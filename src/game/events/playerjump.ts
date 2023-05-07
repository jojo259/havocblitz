import { Event } from "./event";
import { Player } from "../entities/player";
import { entityList } from "../entitymanager";

export class PlayerJump extends Event {

	constructor () {
		super("PlayerJump");
	}

	static doEvent(json: any): void {
		entityList.forEach(entity => {
			if (entity instanceof Player) {
				if (entity.id == json.peerId) {
					entity.jump();
				}
			}
		});
	}
}
