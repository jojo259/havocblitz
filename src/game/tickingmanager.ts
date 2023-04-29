import { doEntityTicks, clientPlayerEntity } from "./entitymanager";
import { TickEvent } from "./tickevents/tickevent";
import { PlayerPosition } from "./tickevents/playerposition";
import { sendData } from "../net/peermanager";

interface QueuedTickEvents extends Array<TickEvent> {
	[index: number]: TickEvent;
}

let queuedTickEvents: QueuedTickEvents = [];

export function doGameTick() {
	doEntityTicks();
	queueClientPositionUpdate();
	sendTickEvents();
}

export function sendTickEvents() {
	let sendObj = {"events": queuedTickEvents};
	let sendStr = JSON.stringify(sendObj);
	sendData(sendStr);
	queuedTickEvents.length = 0;
}

function queueClientPositionUpdate() {
	let newEvent = new PlayerPosition(clientPlayerEntity.posX, clientPlayerEntity.posY);
	queuedTickEvents.push(newEvent);
}
