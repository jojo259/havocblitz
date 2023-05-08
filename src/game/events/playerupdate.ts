import { Event } from "./event";
import { Player } from "../entities/player";
import { entityList } from "../entitymanager";

export class PlayerUpdate extends Event {

	posX: number;
	posY: number;
	velocityX: number;
	velocityY: number;

	constructor (posX: number, posY: number, velocityX: number, velocityY: number) {
		super("PlayerUpdate");
		this.posX = posX;
		this.posY = posY;
		this.velocityX = velocityX;
		this.velocityY = velocityY;
	}

	static doEvent(json: any): void {
		entityList.forEach(entity => {
			if (entity instanceof Player) {
				if (entity.id == json.peerId) {
					let timeDiff = json.timestamp - entity.lastUpdateEventTimestamp;
					if (timeDiff > 0) {
						entity.posX = json.posX;
						entity.posY = json.posY;
						entity.lastUpdateEventTimestamp = json.timestamp;
					}
					else {
						console.warn("PlayerUpdate event is old by: " + (timeDiff * -1) + "ms");
					}
				}
			}
		});
	}
}