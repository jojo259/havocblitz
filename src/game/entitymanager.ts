import { Entity } from "./entities/entity";
import { Player } from "./entities/player";
import { clientPeerId } from "../net/peermanager";
import { tileMap, mapWidth, mapHeight} from "./mapmanager";

export let entityList: Entity[] = [];
export let clientPlayerEntity: Player;

export function addClientPlayerEntity() {
	clientPlayerEntity = new Player(clientPeerId, 0, 0);
	clientPlayerEntity.findSpawn();
	entityList.push(clientPlayerEntity);
}

export function addNewPlayer(peerId: string) {
	let newPlayer = new Player(peerId, 0, 0);
	entityList.push(newPlayer);
}

export function doEntityTicks() {
	entityList.forEach(entity => {
		entity.tick();
	});
}
