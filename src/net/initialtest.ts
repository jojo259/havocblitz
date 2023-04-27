import { Peer } from "peerjs";

function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

let myId = "";
let otherId = "";

if (getRandomInt(1, 2) == 1) {
	myId = "jojo" + 1;
	otherId = "jojo" + 2;
}
else {
	myId = "jojo" + 2;
	otherId = "jojo" + 1;
}

console.log("i am " + myId);
alert("i am " + myId)

const peer = new Peer(myId);

console.log("connecting to peer " + otherId);

setInterval(() => {

	console.log("connecting now");

	const conn = peer.connect(otherId);
	conn.on("data", (data) => {
		console.log("received msg: " + data);
		alert("received msg: " + data)
	});
	conn.on("open", () => {
		conn.send("hello!");
	});
	conn.on("close", () => {
		console.log("connection closed");
	});
	conn.on("error", (err: any) => {
		console.log(err.type)
		console.log(err)
	});
}, 10000); // delay the execution by 10 seconds

peer.on("connection", (conn) => {
	console.log("peer connection")
	conn.on("data", (data) => {
		console.log("received msg: " + data);
		alert("received msg: " + data)
	});
	conn.on("open", () => {
		conn.send("hello!");
	});
	conn.on("close", () => {
		console.log("connection closed");
	});
	conn.on("error", (err: any) => {
		console.log(err.type)
		console.log(err)
	});
});

peer.on('error', function(err: any) {
	console.log(err.type)
	console.log(err)
});

peer.on('disconnected', function() {
	console.log("disconnected, reconnecting");
	peer.reconnect();
});

peer.on('close', function() {
	console.log("peer closed")
});
