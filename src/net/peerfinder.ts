import { Peer } from "peerjs";
import { peerIdPrefix, maxPeerIdNum, clientPeer, peerConnections, ingestPotentialPeerConnection, clientPeerId } from "./peermanager";

let atRandomPeerNum = 0;

export function incrementRandomPeerNum(){
	atRandomPeerNum += 1;
	if (atRandomPeerNum > maxPeerIdNum) {
		atRandomPeerNum = 1;
	}
}

export function findRandomPeer(){
	incrementRandomPeerNum();
	let randomPeerId = peerIdPrefix + atRandomPeerNum;
	console.log("attempting to connect to random peer with id " + randomPeerId);
	console.log("current connections: " + Object.keys(peerConnections).join(", "));

	if (randomPeerId == clientPeerId) {
		console.log("random peer is client peer, skipping");
		return;
	}

	if (peerConnections.hasOwnProperty(randomPeerId)) {
		console.log("already connected to this peer");
		return;
	}

	const conn = clientPeer.connect(randomPeerId);
	ingestPotentialPeerConnection(conn);
}
