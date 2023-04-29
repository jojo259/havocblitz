import { clientPeerId } from "../../net/peermanager";

export abstract class TickEvent {
	peerId: string;
	tickType: string;
	timestamp: number;

	constructor(tickType: string) {
		this.tickType = tickType;
		this.peerId = clientPeerId;
		this.timestamp = Date.now();
	}

	static doEvent(json: any): void {
		throw new Error("Method 'doEvent' should be implemented in the derived class");
	}
}
