import { Event } from "./events/event";
import { PlayerUpdate } from "./events/playerupdate";
import { MapSend } from "./events/mapsend";
import { PlayerJump } from "./events/playerjump";
import { LatencyCheckPing } from "./events/latencycheckping";
import { LatencyCheckPong } from "./events/latencycheckpong";
import { PlayerUse } from "./events/playeruse";
import { CountryCode } from "./events/countrycode";

interface QueuedProcessEvent {
	eventType: string;
	json: JSON;
}

type QueuedProcessEvents = Array<QueuedProcessEvent>;

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
};

export function ingestEventsToProcess(receivedEvents: any) {
	for (const eventJSON of receivedEvents) {
		const eventType: string = eventJSON.type;
		if(!(eventType in funcDict)){
			console.error("unknown event type: " + eventType);
			continue;
		}
		queueEventToProcess(eventType, eventJSON);
	}
}

function queueEventToProcess(eventType: string, json: JSON) {
	queuedProcessEvents.push({eventType: eventType, json: json});
}

export function processReceivedEvents(): void {
	for (const eventJSON of queuedProcessEvents) {
		funcDict[eventJSON.eventType](eventJSON.json);
	}
	queuedProcessEvents.length = 0; // clear array
}
