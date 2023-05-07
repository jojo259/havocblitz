import { entityList, clientPlayerEntity } from "../entitymanager";
import { Player } from "../entities/player";
import { canvasElem, canvasContext } from "../../page/canvas";
import { peerLatencies } from "../../net/latencytracker";
import { drawText, drawLine } from "./renderingmanager";

let netGraphEnabled = false;

const playerMarkerLineStartOffset = canvasElem.width / 32;
const playerMarkerLineLength = canvasElem.width / 32;

export function renderHUD() {
	renderPlayerMarkers();
	if (netGraphEnabled) {
		renderNetGraph();
	}
}

function renderPlayerMarkers() {
	entityList.forEach(function(entity) {
		if (entity instanceof Player) {
			if (entity.id != clientPlayerEntity.id) {
				const direction = {
					x: entity.posX - clientPlayerEntity.posX,
					y: entity.posY - clientPlayerEntity.posY
				};

				const lineStart = {
					x: canvasElem.width / 2 + direction.x * playerMarkerLineStartOffset,
					y: canvasElem.height / 2 + direction.y * playerMarkerLineStartOffset
				};
				const lineEnd = {
					x: canvasElem.width / 2 + direction.x * (playerMarkerLineStartOffset + playerMarkerLineLength),
					y: canvasElem.height / 2 + direction.y * (playerMarkerLineStartOffset + playerMarkerLineLength)
				};

				drawLine(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y, 4, "white");
			}
		}
	});
}

export function toggleNetGraph() {
	netGraphEnabled = !netGraphEnabled;
}

function renderNetGraph() {
	let atPeer = 0;
	Object.entries(peerLatencies).forEach(([peerId, latenciesArray]) => {
		let atY = canvasElem.height - (atPeer + 1) * 16;
		drawText(peerId + ": " + Math.floor(getAverage(latenciesArray)).toString(), "black", 100, atY);
		let atX = 200 + atPeer * 60;
		latenciesArray.forEach((latency) => {
			atX += 1;
			drawLine(atX, canvasElem.height - 16, atX, canvasElem.height - 16 - latency, 1, ["red", "blue", "green"][atPeer % 3]);
		});
		atPeer++;
	});
}

function getAverage(numbers: number[]): number {
	return numbers.reduce((total, num) => total + num, 0) / numbers.length;
}
