import { Entity } from "./entities/entity";
import { Player } from "./entities/player";
import { clientPeerId } from "../net/peermanager";

export let entityList: Entity[] = [];
export let clientPlayerEntity: Player;

export function addClientPlayerEntity() {
	clientPlayerEntity = new Player(clientPeerId, 2, 2);
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
