import { Event } from "./event";
import { Player } from "../entities/player";
import { entityList } from "../entitymanager";

export class PlayerHeldItemSlot extends Event {

	toNum: number;

	constructor (toNum: number) {
		super("PlayerHeldItemSlot");
		this.toNum = toNum;
	}

	static doEvent(json: any): void {
		entityList.forEach(entity => {
			if (entity instanceof Player) {
				if (entity.id == json.peerId) {
					entity.setHeldItemSlot(json.toNum);
				}
			}
		});
	}
}
