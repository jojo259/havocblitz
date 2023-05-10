import { doEntityTicks, clientPlayerEntity } from "./entitymanager";
import { Event } from "./events/event";
import { sendData } from "../net/peermanager";
import { resetKeyPressed } from "./inputtracker";
import { tickLatencyTracker } from "../net/latencytracker";
import { drawGame } from "./render/renderingmanager";

let ticksPerSecond = 64;
let tickIntervalMs = 1000 / ticksPerSecond;
let lastTicked = Date.now();

interface QueuedEvents extends Array<Event> {
	[index: number]: Event;
}

let queuedEvents: QueuedEvents = [];

export function considerTicking() {
	while (Date.now() > lastTicked + tickIntervalMs) {
		lastTicked += tickIntervalMs;
		doGameTick();
		drawGame();
	}
}

function doGameTick() {
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
