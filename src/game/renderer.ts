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

export function drawImageRelativeCircular(image: CanvasImageSource, drawX: number, drawY: number, drawRadius: number) {
	drawImageRelative(image, drawX - drawRadius / 2, drawY - drawRadius / 2, drawRadius, drawRadius)
}

export function drawImageRelative(image: CanvasImageSource, drawX: number, drawY: number, drawSizeX: number, drawSizeY: number) {
	canvasContext.drawImage(image, (drawX - clientPlayerEntity.posX + renderScaleX / 2 - 0.5) * canvasScale, (drawY - clientPlayerEntity.posY + renderScaleY / 2 - 0.5) * canvasScale, drawSizeX * canvasScale, drawSizeY * canvasScale);
}

function clearCanvas() {
	canvasContext.fillStyle = "#044";
	canvasContext.fillRect(0, 0, 9999, 9999);
}
