import { Event } from "./events/event";
import { PlayerUpdate } from "./events/playerupdate";
import { MapSend } from "./events/mapsend";
import { PlayerJump } from "./events/playerjump";
import { LatencyCheckPing } from "./events/latencycheckping";
import { LatencyCheckPong } from "./events/latencycheckpong";
import { PlayerUse } from "./events/playeruse";

export function processReceivedEvents(receivedEvents: any[]): void {
	for (const eventJSON of receivedEvents) {
		const eventType: string = eventJSON.type;
		let eventClass: Event;
		switch (eventType) { // change to use dict instead
			case "PlayerUpdate":
				PlayerUpdate.doEvent(eventJSON);
				break;
			case "MapSend":
				MapSend.doEvent(eventJSON);
				break;
			case "PlayerJump":
				PlayerJump.doEvent(eventJSON);
				break;
			case "LatencyCheckPing":
				LatencyCheckPing.doEvent(eventJSON);
				break;
			case "LatencyCheckPong":
				LatencyCheckPong.doEvent(eventJSON);
				break;
			case "PlayerUse":
				PlayerUse.doEvent(eventJSON);
				break;
			default:
				console.log("unknown event type: " + eventType)
				continue;
		}
	}
}
