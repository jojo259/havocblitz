import { Event } from "./event";
import { Player } from "../entities/player";
import { entityList } from "../entitymanager";

export class PlayerHealth extends Event {

	health: number;

	constructor (health: number) {
		super("PlayerHealth");
		this.health = health;
	}

	static doEvent(json: any): void {
		entityList.forEach(entity => {
			if (entity instanceof Player) {
				if (entity.id == json.peerId) {
					entity.health = json.health;
				}
			}
		});
	}
}
