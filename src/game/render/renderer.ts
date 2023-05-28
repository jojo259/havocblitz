import { entityList, clientPlayerEntity } from "../entitymanager";
import { Player, playerItems } from "../entities/player";
import { canvasElem, canvasScale, canvasContext, renderScaleX, renderScaleY } from "../../page/canvas";
import { peerLatencies } from "../../net/latencytracker";
import { drawText, drawLine, drawImage, clearCanvas, drawImageRelative, drawCircleRelative } from "./renderingfuncs";
import { renderMap, mapWidth, mapHeight } from "../mapmanager";
import { PhysicsEntity } from "../entities/physicsentity";
import { debugMode } from "../../page/debugmode";

export let debugVisualsEnabled = debugMode;

const playerMarkerLineStartOffset = canvasElem.width / 32;
const playerMarkerLineLength = canvasElem.width / 32;

const backgroundImage = new Image();
backgroundImage.src = "./game/sprites/background.png";

let heldItemSlotScale = 2;
let heldItemSlotPosX = 0.5;
let heldItemSlotPosY = renderScaleY - heldItemSlotScale - 0.5;

const heldItemSlotImage = new Image();
heldItemSlotImage.src = "./game/sprites/helditemslot.png";

export function renderGame() {
	clearCanvas();
	renderBackground();
	renderMap();
	entityList.forEach(entity => {
		entity.draw();
		if (debugVisualsEnabled) {
			if (entity instanceof PhysicsEntity) {
				drawCircleRelative(entity.posX, entity.posY, entity.diameter, "red");
			}
		}
	});
	renderHUD();
}

function renderBackground() {
	drawImage(backgroundImage, clientPlayerEntity.posX / mapWidth * canvasElem.width * -1 / canvasScale, clientPlayerEntity.posY / mapHeight * canvasElem.height * -1 / canvasScale, canvasElem.width * 2 / canvasScale, canvasElem.height * 2 / canvasScale);
}

function renderHUD() {
	renderPlayerMarkers();
	if (debugVisualsEnabled) {
		renderNetGraph();
	}
	renderItemSlot();
}

function renderItemSlot() {
	drawImage(heldItemSlotImage, heldItemSlotPosX, heldItemSlotPosY, heldItemSlotScale, heldItemSlotScale);
	playerItems[clientPlayerEntity.heldItemSlot].draw(heldItemSlotPosX, heldItemSlotPosY, heldItemSlotScale);
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

export function toggleDebugVisuals() {
	debugVisualsEnabled = !debugVisualsEnabled;
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
