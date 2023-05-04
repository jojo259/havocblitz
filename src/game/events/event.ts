import { clientPeerId } from "../../net/peermanager";

export abstract class Event {
	peerId: string = clientPeerId;
	type: string;
	timestamp: number = Date.now();

	constructor(type: string) {
		this.type = type;
	}

	static doEvent(json: any): void {
		throw new Error("Method 'doEvent' should be implemented in the derived class");
	}
}
