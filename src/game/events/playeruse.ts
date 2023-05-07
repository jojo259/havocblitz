import { Event } from "./event";
import { Player } from "../entities/player";
import { entityList } from "../entitymanager";

export class PlayerUse extends Event {

	mousePosX: number;
	mousePosY: number;

	constructor (mousePosX: number, mousePosY: number) {
		super("PlayerUse");
		this.mousePosX = mousePosX;
		this.mousePosY = mousePosY;
	}

	static doEvent(json: any): void {
		entityList.forEach(entity => {
			if (entity instanceof Player) {
				if (entity.id == json.peerId) {
					entity.useItem(json.mousePosX, json.mousePosY);
				}
			}
		});
	}
}
