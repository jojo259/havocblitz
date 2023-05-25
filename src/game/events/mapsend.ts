import { Event } from "./event";
import { tileMap, currentMapGeneratedTimestamp, setCurrentMapGeneratedTimestamp } from "../mapmanager";
import { clientPlayerEntity } from "../entitymanager";
import { compress, decompress } from "lz-string";

export class MapSend extends Event {

	mapGeneratedTimestamp = currentMapGeneratedTimestamp;
	compressedMapStr: string;

	constructor() {
		super("MapSend");
		let mapStr = "";
		for (let x = 0; x < tileMap.length; x++) {
			for (let y = 0; y < tileMap[x].length; y++) {
				mapStr += tileMap[x][y];
			}
		}
		this.compressedMapStr = compress(mapStr);
	}

	static doEvent(json: any): void {
		console.log("received map");
		if (json.mapGeneratedTimestamp >= currentMapGeneratedTimestamp) {
			console.log("map is newer than client map, ignoring");
			return;
		}
		const sentMapStr: string = decompress(json.compressedMapStr);
		if (!sentMapStr) {
			console.error("no map received (probably compression failure)");
			return;
		}
		let atIndex = 0;
		for (let x = 0; x < tileMap.length; x++) {
			for (let y = 0; y < tileMap[x].length; y++) {
				tileMap[x][y] = parseInt(sentMapStr.charAt(atIndex));
				atIndex++;;
			}
		}
		clientPlayerEntity.findSpawn();
		setCurrentMapGeneratedTimestamp(json.mapGeneratedTimestamp);
	}
}
