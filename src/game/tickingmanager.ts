import { doEntityTicks, clientPlayerEntity } from "./entitymanager";
import { Event } from "./events/event";
import { PlayerPosition } from "./events/playerposition";
import { sendData } from "../net/peermanager";
import { resetKeyPresses } from "./keytracker";

interface QueuedEvents extends Array<Event> {
	[index: number]: Event;
}

let queuedEvents: QueuedEvents = [];

export function doGameTick() {
	doEntityTicks();
	queueEvent(new PlayerPosition(clientPlayerEntity.posX, clientPlayerEntity.posY));
	sendEvents();
	resetKeyPresses();
}

export function sendEvents() {
	let sendObj = {"events": queuedEvents};
	let sendStr = JSON.stringify(sendObj);
	sendData(sendStr);
	queuedEvents.length = 0; // clears the array
}

export function queueEvent(event: Event) {
	queuedEvents.push(event);
}
