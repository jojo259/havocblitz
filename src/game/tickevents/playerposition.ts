import { TickEvent } from "./tickevent";
import { Player } from "../entities/player";
import { entityList } from "../entitymanager";

export class PlayerPosition extends TickEvent {

	newPosX: number;
	newPosY: number;

	constructor (newPosX: number, newPosY: number) {
		super("PlayerPosition");
		this.newPosX = newPosX;
		this.newPosY = newPosY;
	}

	static doEvent(json: any): void {
		entityList.forEach(entity => {
			if (entity instanceof Player) {
				if (entity.id == json.peerId) {
					let timeDiff = json.timestamp - entity.lastPositionEventTimestamp;
					if (timeDiff > 0) {
						entity.posX = json.newPosX;
						entity.posY = json.newPosY;
						entity.lastPositionEventTimestamp = json.timestamp;
					}
					else {
						console.log("PlayerPosition event is old by:" + (timeDiff * -1) + "ms");
					}
				}
			}
		});
	}
}
