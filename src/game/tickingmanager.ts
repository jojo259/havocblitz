import { doEntityTicks, clientPlayerEntity } from "./entitymanager";
import { Event } from "./events/event";
import { sendData } from "../net/peermanager";
import { resetKeyPressed } from "./inputtracker";
import { tickLatencyTracker } from "../net/latencytracker";

interface QueuedEvents extends Array<Event> {
	[index: number]: Event;
}

let queuedEvents: QueuedEvents = [];

export function doGameTick() {
	tickLatencyTracker();
	doEntityTicks();
	sendEvents();
	resetKeyPressed();
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
