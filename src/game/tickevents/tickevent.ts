import { clientPeerId } from "../../net/peermanager";

export abstract class TickEvent {
	peerId: string = clientPeerId;
	tickType: string;
	timestamp: number = Date.now();

	constructor(tickType: string) {
		this.tickType = tickType;
	}

	static doEvent(json: any): void {
		throw new Error("Method 'doEvent' should be implemented in the derived class");
	}
}
