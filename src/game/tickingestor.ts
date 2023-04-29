import { TickEvent } from "./tickevents/tickevent";
import { PlayerPosition } from "./tickevents/playerposition";

export function processReceivedTickEvents(receivedTickEvents: any[]): void {
	for (const tickEventJSON of receivedTickEvents) {
		const tickType: string = tickEventJSON.tickType;
		let tickEventClass: TickEvent;
		switch (tickType) { // change to use dict instead
			case "PlayerPosition":
				PlayerPosition.doEvent(tickEventJSON);
				break;
			default:
				continue;
		}
	}
}
