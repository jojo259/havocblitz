import { Peer } from "peerjs";
import { peerIdPrefix, maxPeerIdNum, getRandomPeerId, clientPeer } from "./peermanager";

export function findRandomPeer(){
	let randomPeerId = getRandomPeerId();
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
