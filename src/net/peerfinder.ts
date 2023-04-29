import { Peer } from "peerjs";
import { peerIdPrefix, maxPeerIdNum, clientPeer, peerConnections } from "./peermanager";

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
	console.log("current connections:");
	console.log(peerConnections);

	if (peerConnections.hasOwnProperty(randomPeerId)) {
		console.log("already connected to this peer");
		return;
	}

	const conn = clientPeer.connect(randomPeerId);
	conn.on("data", (data) => {
		console.log("received msg: " + data);
		alert("received msg: " + data)
	});
	conn.on("open", () => {
		console.log("connected to peer")
		conn.send("hello!");
		peerConnections[randomPeerId] = conn;
	});
	conn.on("close", () => {
		console.log("connection closed");
		delete peerConnections[randomPeerId];
	});
	conn.on("error", (err: any) => {
		console.log(err.type)
		console.log(err)
		delete peerConnections[randomPeerId];
	});
}
