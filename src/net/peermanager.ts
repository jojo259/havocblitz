import { Peer, DataConnection } from "peerjs";
import { Player } from "../game/entities/player";
import { addNewPlayer } from "../game/entitymanager";
import { MapSend } from "../game/events/mapsend";
import { queueEvent } from "../game/tickingmanager";
import { processReceivedEvents } from "../game/eventingestor";

export let clientPeerId: string;
export let clientPeer: Peer;

export let peerIdPrefix = "havocblitz";
export let maxPeerIdNum = 16;

interface PeerConnections {
	[peerId: string]: DataConnection;
}

export let peerConnections: PeerConnections = {};

initClientPeer();

function initClientPeer() {
	clientPeerId = getRandomPeerId();
	console.log("client peer id is " + clientPeerId);

	clientPeer = new Peer(clientPeerId)

	clientPeer.on('error', function(err: any) {
		if (err.type == "peer-unavailable") {
			return;
		}
		/*
		if (err.type == "unavailable-id") {
			console.log("client peer id unavailable, remaking client peer")
			initClientPeer();
			setTimeout(() => {
				initClientPeer();
			}, 1000);
			return;
		}
		*/
		console.log(err.type)
		console.log(err)
	});

	clientPeer.on('disconnected', function() {
		console.log("client peer disconnected, reconnecting");
		clientPeer.reconnect();
	});

	clientPeer.on('close', function() {
		console.log("client peer closed")
	});

	clientPeer.on("connection", (conn) => {
		ingestPotentialPeerConnection(conn);
	});
}

function getRandomInt(min: number, max: number): number{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomPeerId(): string {
	let randomPeerId = peerIdPrefix + getRandomInt(1, maxPeerIdNum)
	return randomPeerId;
}

export function sendData(dataStr: string){
	for (const [peerId, conn] of Object.entries(peerConnections)) {
		conn.send(dataStr);
	}
}

export function ingestPotentialPeerConnection(conn: DataConnection){
	conn.on("data", (data) => {
		if (typeof data == "string") {
			let dataJson: JSON = JSON.parse(data);
			if ("events" in dataJson) {
				if (Array.isArray(dataJson.events)) {
					processReceivedEvents(dataJson.events);
				}
			}
		}
	});
	conn.on("open", () => {
		console.log("connected to peer")
		peerConnections[conn.peer] = conn;
		addNewPlayer(conn.peer);
		queueEvent(new MapSend());
	});
	conn.on("close", () => {
		console.log("connection closed");
		delete peerConnections[conn.peer];
	});
	conn.on("error", (err: any) => {
		console.log(err.type)
		console.log(err)
		delete peerConnections[conn.peer];
	});
	setTimeout(() => {
		if (!conn.open) {
			console.log("closing unopen connection");
			conn.close();
		}
	}, 8000);
}

window.addEventListener("beforeunload", (event) => {
	console.log("closing all connections and destroying client peer");
	for (const [peerId, conn] of Object.entries(peerConnections)) {
		conn.close();
		delete peerConnections[peerId];
	}
	clientPeer.destroy();
});
