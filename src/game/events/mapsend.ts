import { Event } from "./event";
import { tileMap, currentMapGeneratedTimestamp, setCurrentMapGeneratedTimestamp } from "../mapmanager";
import { clientPlayerEntity } from "../entitymanager";
import { compress, decompress } from "lz-string";

export class MapSend extends Event {

	mapGeneratedTimestamp = currentMapGeneratedTimestamp;
	compressedMapStr: string;

	constructor() {
		super("MapSend");
		this.compressedMapStr = compress(JSON.stringify(tileMap));
	}

	static doEvent(json: any): void {
		console.log("received map");
		if (json.mapGeneratedTimestamp >= currentMapGeneratedTimestamp) {
			console.log("map is newer than client map, ignoring");
			return;
		}
		const sentMap: number[][] = JSON.parse(decompress(json.compressedMapStr));
		for (let x = 0; x < tileMap.length; x++) {
			for (let y = 0; y < tileMap[x].length; y++) {
				tileMap[x][y] = sentMap[x][y];
			}
		}
		clientPlayerEntity.findSpawn();
		setCurrentMapGeneratedTimestamp(json.mapGeneratedTimestamp);
	}
}
