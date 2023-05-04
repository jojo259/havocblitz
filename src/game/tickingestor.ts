import { Event } from "./events/event";
import { PlayerPosition } from "./events/playerposition";

export function processReceivedEvents(receivedEvents: any[]): void {
	for (const eventJSON of receivedEvents) {
		const eventType: string = eventJSON.type;
		let eventClass: Event;
		switch (eventType) { // change to use dict instead
			case "PlayerPosition":
				PlayerPosition.doEvent(eventJSON);
				break;
			default:
				continue;
		}
	}
}
