import { Event } from "./event";
import { tileMap } from "../mapmanager";
import { clientPlayerEntity } from "../entitymanager";

export class MapSend extends Event {

	clientInitializedAt = clientPlayerEntity.initializedAt;
	sentMap: number[][] = tileMap;

	constructor () {
		super("MapSend");
	}

	static doEvent(json: any): void {
		console.log("received map");
		if (json.clientInitializedAt >= clientPlayerEntity.initializedAt) {
			console.log("map is newer than client map, ignoring");
			return;
		}
		for (let x = 0; x < tileMap.length; x++) {
			for (let y = 0; y < tileMap[x].length; y++) {
				tileMap[x][y] = json.sentMap[x][y];
			}
		}
	}
}
