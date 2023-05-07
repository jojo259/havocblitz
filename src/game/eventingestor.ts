import { Event } from "./events/event";
import { PlayerPosition } from "./events/playerposition";
import { MapSend } from "./events/mapsend";
import { PlayerJump } from "./events/playerjump";

export function processReceivedEvents(receivedEvents: any[]): void {
	for (const eventJSON of receivedEvents) {
		const eventType: string = eventJSON.type;
		let eventClass: Event;
		switch (eventType) { // change to use dict instead
			case "PlayerPosition":
				PlayerPosition.doEvent(eventJSON);
				break;
			case "MapSend":
				MapSend.doEvent(eventJSON);
				break;
			case "PlayerJump":
				PlayerJump.doEvent(eventJSON);
				break;
			default:
				console.log("unknown event type: " + eventType)
				continue;
		}
	}
}
