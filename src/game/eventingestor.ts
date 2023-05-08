import { PlayerUpdate } from "./events/playerupdate";
import { MapSend } from "./events/mapsend";
import { PlayerJump } from "./events/playerjump";
import { LatencyCheckPing } from "./events/latencycheckping";
import { LatencyCheckPong } from "./events/latencycheckpong";
import { PlayerUse } from "./events/playeruse";

type Dictionary<T> = {
	[key: string]: T;
};

const funcDict: Dictionary<Function> = {
	"PlayerUpdate": (JSON: any) => PlayerUpdate.doEvent(JSON),
	"MapSend": (JSON: any) => MapSend.doEvent(JSON),
	"PlayerJump": (JSON: any) => PlayerJump.doEvent(JSON),
	"LatencyCheckPing": (JSON: any) => LatencyCheckPing.doEvent(JSON),
	"LatencyCheckPong": (JSON: any) => LatencyCheckPong.doEvent(JSON),
	"PlayerUse": (JSON: any) => PlayerUse.doEvent(JSON)
};

export function processReceivedEvents(receivedEvents: any[]): void {
	for (const eventJSON of receivedEvents) {
		const eventType: string = eventJSON.type;
		if(!(eventType in funcDict)){
			console.error("unknown event type: " + eventType);
			continue;
		}
		funcDict[eventType](eventJSON);
	}
}
