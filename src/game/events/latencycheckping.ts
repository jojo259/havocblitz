import { Event } from "./event";
import { LatencyCheckPong } from "./latencycheckpong";
import { queueEvent } from "../tickingmanager";

export class LatencyCheckPing extends Event {

	constructor () {
		super("LatencyCheckPing");
	}

	static doEvent(json: any): void {
		queueEvent(new LatencyCheckPong(json.peerId));
	}
}
