import { Peer } from "peerjs";
import { peerIdPrefix, maxPeerIdNum, clientPeer } from "./peermanager";

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

	const conn = clientPeer.connect(randomPeerId);
	conn.on("data", (data) => {
		console.log("received msg: " + data);
		alert("received msg: " + data)
	});
	conn.on("open", () => {
		console.log("connected to peer")
		conn.send("hello!");
	});
	conn.on("close", () => {
		console.log("connection closed");
	});
	conn.on("error", (err: any) => {
		console.log(err.type)
		console.log(err)
	});
}
