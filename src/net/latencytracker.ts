import { peerConnections } from "./peermanager";
import { queueEvent } from "../game/tickingmanager";
import { LatencyCheckPing } from "../game/events/latencycheckping";

export let sentCheckLatencyEvents: { [key: string]: number } = {};
export let peerLatencies: { [key: string]: number[] } = {};
let lastCheckedLatencies = 0;

export function tickLatencyTracker() {
	if (Date.now() >= lastCheckedLatencies + 1000) {
		lastCheckedLatencies = Date.now();
		checkLatencies();
	}
}

function checkLatencies() {
	Object.entries(peerConnections).forEach(([peerId, peerConnection]) => {
		sentCheckLatencyEvents[peerId] = Date.now();
		queueEvent(new LatencyCheckPing());
	});
}
