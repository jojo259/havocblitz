import { Entity } from "./entities/entity";
import { Player } from "./entities/player";
import { clientPeerId } from "../net/peermanager";
import { tileMap, mapWidth, mapHeight} from "./mapmanager";
import { SpriteEntity } from "./entities/spriteentity";
import { clearCache } from "./render/spritemanager";
import { queueCanvasResizeCountdownTimeMs } from "../page/canvas";

export let entityList: Entity[] = [];
export let clientPlayerEntity: Player = new Player(clientPeerId, 0, 0, true);

export function spawnEntity(entity: Entity) {
	entityList.push(entity);
}

export function addClientPlayerEntity() {
	clientPlayerEntity.findSpawn();
	spawnEntity(clientPlayerEntity);
}

export function addNewPlayer(peerId: string) {
	let newPlayer = new Player(peerId, 0, 0, false);
	spawnEntity(newPlayer);
}

export function reloadSprites() {
	console.log("reloading sprites");
	clearCache();
	entityList.forEach(entity => {
		if (entity instanceof SpriteEntity) {
			entity.loadSprite();
		}
	});
}

export function doEntityTicks() {
	entityList.forEach(entity => {
		entity.tick();
	});
}

addEventListener("resize", (event) => {setTimeout(() => {reloadSprites()}, queueCanvasResizeCountdownTimeMs + 100)});
