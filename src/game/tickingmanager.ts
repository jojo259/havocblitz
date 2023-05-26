import { doEntityTicks, clientPlayerEntity } from "./entitymanager";
import { Event } from "./events/event";
import { sendData } from "../net/peermanager";
import { resetKeyPressed, updateMousePos } from "./inputtracker";
import { tickLatencyTracker } from "../net/latencytracker";
import { renderGame, debugVisualsEnabled } from "./render/renderer";
import { processReceivedEvents } from "./eventingestor";

export let considerTickingIntervalMs = 1;
let ticksPerSecond = 64;
let tickIntervalMs = 1000 / ticksPerSecond;
let lastTicked = Date.now();

interface QueuedEvents extends Array<Event> {
	[index: number]: Event;
}

let queuedEvents: QueuedEvents = [];

export function considerTicking() {
	let sentBehindWarning = false;
	let lastTickDiffMs = Date.now() - lastTicked;
	while (lastTickDiffMs > tickIntervalMs) {
		let ticksBehind = Math.floor((lastTickDiffMs - tickIntervalMs) / tickIntervalMs);
		if (!sentBehindWarning && ticksBehind > 0) {
			sentBehindWarning = true;
			console.warn("ticking behind by " + ticksBehind + " tick(s)");
		}
		lastTicked += tickIntervalMs;
		if (debugVisualsEnabled) { // switch the order so game logic can draw stuff after the regular drawing has happened (introduces 1 tick of rendering latency)
			renderGame();
			doGameTick();
		}
		else {
			doGameTick();
			renderGame();
		}
		lastTickDiffMs = Date.now() - lastTicked;
	}
}

function doGameTick() {
	processReceivedEvents();
	tickLatencyTracker();
	updateMousePos();
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
