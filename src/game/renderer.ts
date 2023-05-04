import { Entity } from "./entities/entity";
import { canvasContext, canvasScale, renderScaleX, renderScaleY } from "../page/canvas";
import { entityList, clientPlayerEntity } from "./entitymanager";
import { renderMap } from "./mapmanager";

export function drawGame() {
	clearCanvas();
	entityList.forEach(entity => {
		entity.draw();
	});
	renderMap();
}

export function drawImageRelativeCircular(image: CanvasImageSource, drawX: number, drawY: number, drawDiameter: number) {
	drawImageRelative(image, drawX - drawDiameter / 2, drawY - drawDiameter / 2, drawDiameter, drawDiameter)
}

export function drawImageRelative(image: CanvasImageSource, drawX: number, drawY: number, drawSizeX: number, drawSizeY: number) {
	canvasContext.drawImage(image, getRelativeX(drawX), getRelativeY(drawY), drawSizeX * canvasScale, drawSizeY * canvasScale);
}

export function drawTextRelative(content: string, color: string, drawX: number, drawY: number) {
	canvasContext.font = "16px Arial";
	canvasContext.fillStyle = color;
	canvasContext.textAlign = "center";
	canvasContext.fillText(content, getRelativeX(drawX), getRelativeY(drawY));
}

function getRelativeX(x: number): number {
	return (x - clientPlayerEntity.posX + renderScaleX / 2 - 0.5) * canvasScale;
}

function getRelativeY(y: number): number {
	return (y - clientPlayerEntity.posY + renderScaleY / 2 - 0.5) * canvasScale;
}

function clearCanvas() {
	canvasContext.fillStyle = "#044";
	canvasContext.fillRect(0, 0, 9999, 9999);
}
