import { Event } from "./events/event";
import { PlayerUpdate } from "./events/playerupdate";
import { MapSend } from "./events/mapsend";
import { PlayerJump } from "./events/playerjump";
import { LatencyCheckPing } from "./events/latencycheckping";
import { LatencyCheckPong } from "./events/latencycheckpong";
import { PlayerUse } from "./events/playeruse";
import { CountryCode } from "./events/countrycode";
import { PlayerHeldItemSlot } from "./events/playerhelditemslot";
import { PlayerHealth } from "./events/playerhealth";

let peersLastReceivedEventsFrom: Dictionary<number> = {};

type QueuedProcessEvents = Array<any>;

let queuedProcessEvents: QueuedProcessEvents = [];

type Dictionary<T> = {
	[key: string]: T;
};

const funcDict: Dictionary<Function> = {
	"PlayerUpdate": (JSON: any) => PlayerUpdate.doEvent(JSON),
	"MapSend": (JSON: any) => MapSend.doEvent(JSON),
	"PlayerJump": (JSON: any) => PlayerJump.doEvent(JSON),
	"LatencyCheckPing": (JSON: any) => LatencyCheckPing.doEvent(JSON),
	"LatencyCheckPong": (JSON: any) => LatencyCheckPong.doEvent(JSON),
	"PlayerUse": (JSON: any) => PlayerUse.doEvent(JSON),
	"CountryCode": (JSON: any) => CountryCode.doEvent(JSON),
	"PlayerHeldItemSlot": (JSON: any) => PlayerHeldItemSlot.doEvent(JSON),
	"PlayerHealth": (JSON: any) => PlayerHealth.doEvent(JSON),
};

export function ingestEventsToProcess(receivedEvents: any) {
	for (const eventJSON of receivedEvents) {
		if(!(eventJSON.type in funcDict)){
			console.error("unknown event type: " + eventJSON.type);
			continue;
		}
		if (!peersLastReceivedEventsFrom.hasOwnProperty(eventJSON.peerId)) {
			peersLastReceivedEventsFrom[eventJSON.peerId] = eventJSON.timestamp;
		}
		let timeDiff = eventJSON.timestamp - peersLastReceivedEventsFrom[eventJSON.peerId];
		if (timeDiff >= 0) {
			peersLastReceivedEventsFrom[eventJSON.peerId] = eventJSON.timestamp;
		}
		else {
			console.warn("ignoring old event " + eventJSON.type + " from peer " + eventJSON.peerId + ", old by " + (timeDiff * -1) + "ms");
			continue;
		}
		queueEventToProcess(eventJSON);
	}
}

function queueEventToProcess(eventJSON: any) {
	queuedProcessEvents.push(eventJSON);
}

export function processReceivedEvents(): void {
	for (const eventJSON of queuedProcessEvents) {
		peersLastReceivedEventsFrom[eventJSON.peerId] = eventJSON.timestamp;
		funcDict[eventJSON.type](eventJSON);
	}
	queuedProcessEvents.length = 0; // clear array
}
