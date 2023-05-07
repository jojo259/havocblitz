import { Event } from "./event";
import { peerLatencies, sentCheckLatencyEvents } from "../../net/latencytracker";
import { clientPeerId } from "../../net/peermanager";

export class LatencyCheckPong extends Event {

	respondingToPeerId: string;

	constructor (respondingToPeerId: string) {
		super("LatencyCheckPong");
		this.respondingToPeerId = respondingToPeerId;
	}

	static doEvent(json: any): void {
		if (json.respondingToPeerId != clientPeerId) {
			return;
		}
		if (!sentCheckLatencyEvents.hasOwnProperty(json.peerId)) {
			console.error("failed LatencyCheckPong from: " + json.peerId); // should never happen
			return;
		}
		if (!peerLatencies.hasOwnProperty(json.peerId)) {
			peerLatencies[json.peerId] = [];
		}
		let peerLatency = Date.now() - sentCheckLatencyEvents[json.peerId];
		peerLatencies[json.peerId].push(peerLatency);
		if (peerLatencies[json.peerId].length > 60) {
			peerLatencies[json.peerId].shift();
		}
	}
}
