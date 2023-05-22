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
					entity.posX = json.posX;
					entity.posY = json.posY;
				}
			}
		});
	}
}
