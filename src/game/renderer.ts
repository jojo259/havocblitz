import { Entity } from "./entities/entity";
import { canvasContext, canvasScale, renderScaleX, renderScaleY } from "../page/canvas";
import { entityList, clientPlayerEntity } from "./entitymanager";

export function drawGame() {
	clearCanvas();
	entityList.forEach(entity => {
		entity.draw();
	});
}

export function drawImageRelativeCircular(image: CanvasImageSource, drawX: number, drawY: number, drawRadius: number) {
	drawImageRelative(image, drawX - drawRadius, drawY - drawRadius, drawRadius * 2, drawRadius * 2)
}

export function drawImageRelative(image: CanvasImageSource, drawX: number, drawY: number, drawSizeX: number, drawSizeY: number) {
	canvasContext.drawImage(image, (drawX - (clientPlayerEntity.posX - clientPlayerEntity.radius / 2) + renderScaleX / 2 - 0.5) * canvasScale, (drawY - (clientPlayerEntity.posY - clientPlayerEntity.radius / 2) + renderScaleY / 2 - 0.5) * canvasScale, drawSizeX * canvasScale, drawSizeY * canvasScale);
}

function clearCanvas() {
	canvasContext.fillStyle = "#044";
	canvasContext.fillRect(0, 0, 9999, 9999);
}
