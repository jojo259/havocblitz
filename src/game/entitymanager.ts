import { Entity } from "./entities/entity";
import { Player } from "./entities/player";
import { clientPeerId } from "../net/peermanager";
import { tileMap, generateSpawn, mapWidth, mapHeight} from "./mapmanager";

export let entityList: Entity[] = [];
export let clientPlayerEntity: Player;

export function setPlayerTeam(peerId: string, posX: number, posY: number): Player {
	let team="", sprite="";
	let pureID = +peerId.replace(/\D/g, "");
	if (pureID % 2 == 0){
		team = "red";
		sprite = "game/sprites/playerred.png";
	}
	else if (pureID % 2 == 1){
		team = "blue";
		sprite = "game/sprites/playerblue.png";
	}
	else{
		team = "NaN";
		sprite = "game/sprites/player.png";
	}
	console.log(sprite)
	return new Player(peerId, team, sprite, posX, posY);
}

export function addClientPlayerEntity() {
	let spawnCoords = generateSpawn(tileMap, mapWidth, mapHeight);
	clientPlayerEntity = setPlayerTeam(clientPeerId, spawnCoords[0], spawnCoords[1]);
	entityList.push(clientPlayerEntity);
}

export function addNewPlayer(peerId: string) {
	let spawnCoords = generateSpawn(tileMap, mapWidth, mapHeight);
	let newPlayer = setPlayerTeam(peerId, spawnCoords[0], spawnCoords[1]);
	entityList.push(newPlayer);
}

export function doEntityTicks() {
	entityList.forEach(entity => {
		entity.tick();
	});
}
