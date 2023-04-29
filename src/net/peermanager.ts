import { Peer, DataConnection } from "peerjs";

export let peerIdPrefix = "havocblitz";
export let maxPeerIdNum = 16;

interface PeerConnections {
	[peerId: string]: DataConnection;
}

export let peerConnections: PeerConnections = {};

function getRandomInt(min: number, max: number): number{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomPeerId(): string {
	let randomPeerId = peerIdPrefix + getRandomInt(1, maxPeerIdNum)
	return randomPeerId;
}

let myId = getRandomPeerId();
console.log("my peer id is " + myId);

export let clientPeer = new Peer(myId)

clientPeer.on('error', function(err: any) {
	if (err.type == "peer-unavailable") {
		return;
	}
	console.log(err.type)
	console.log(err)
});

clientPeer.on('disconnected', function() {
	console.log("disconnected, reconnecting");
	clientPeer.reconnect();
});

clientPeer.on('close', function() {
	console.log("peer closed")
});

window.addEventListener("beforeunload", (event) => {
	console.log("closing all connections and destroying client peer");
	for (const [peerId, conn] of Object.entries(peerConnections)) {
		conn.close();
	}
	clientPeer.destroy();
});
