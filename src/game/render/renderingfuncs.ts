import { canvasContext, canvasScale, renderScaleX, renderScaleY } from "../../page/canvas";
import { clientPlayerEntity } from "../entitymanager";

export function drawImageRelativeCircularRotated(image: HTMLImageElement, drawX: number, drawY: number, drawDiameter: number, rotatedDegrees: number) {
	canvasContext.save();

	const centerX = getRelativeX(drawX)
	const centerY = getRelativeY(drawY)
	canvasContext.translate(centerX, centerY);

	const radians = (rotatedDegrees * Math.PI) / 180;
	canvasContext.rotate(radians);
	canvasContext.drawImage(
		image,
		- (drawDiameter * canvasScale) / 2,
		- (drawDiameter * canvasScale) / 2,
		drawDiameter * canvasScale,
		drawDiameter * canvasScale
	);

	canvasContext.restore();
}

export function drawImageRelativeCircular(image: HTMLImageElement, drawX: number, drawY: number, drawDiameter: number) {
	drawImageRelative(image, drawX - drawDiameter / 2, drawY - drawDiameter / 2, drawDiameter, drawDiameter);
}

export function drawImageRelative(image: HTMLImageElement, drawX: number, drawY: number, drawSizeX: number, drawSizeY: number) {
	canvasContext.drawImage(image, getRelativeX(drawX), getRelativeY(drawY), drawSizeX * canvasScale, drawSizeY * canvasScale);
}

export function drawImageRelativeClipped(
	image: HTMLImageElement,
	drawX: number,
	drawY: number,
	drawSizeX: number,
	drawSizeY: number,
	points: number[][]
) {
	let relativeX = getRelativeX(drawX);
	let relativeY = getRelativeY(drawY);

	canvasContext.save();
	const polygon = new Path2D();
	polygon.moveTo(points[0][0] * canvasScale + relativeX, points[0][1] * canvasScale + relativeY);

	for (let i = 1; i < points.length; i++) {
		polygon.lineTo(points[i][0] * canvasScale + relativeX, points[i][1] * canvasScale + relativeY);
	}

	polygon.closePath();
	canvasContext.clip(polygon);
	canvasContext.drawImage(
		image,
		relativeX,
		relativeY,
		drawSizeX * canvasScale,
		drawSizeY * canvasScale
	);
	canvasContext.restore();
}

export function drawImageRelativeRotated(image: CanvasImageSource, drawX: number, drawY: number, drawSizeX: number, drawSizeY: number, rotatedDegrees: number) {
	canvasContext.save();
	
	const centerX = getRelativeX(drawX) + (drawSizeX * canvasScale) / 2;
	const centerY = getRelativeY(drawY) + (drawSizeY * canvasScale) / 2;
	canvasContext.translate(centerX, centerY);

	const radians = (rotatedDegrees * Math.PI) / 180;
	canvasContext.rotate(radians);
	canvasContext.drawImage(
		image,
		- (drawSizeX * canvasScale) / 2,
		- (drawSizeY * canvasScale) / 2,
		drawSizeX * canvasScale,
		drawSizeY * canvasScale
	);

	canvasContext.restore();
}

export function drawImageRelativeRotatedTranslated(image: CanvasImageSource, drawX: number, drawY: number, drawSizeX: number, drawSizeY: number, rotatedDegrees: number, translateX: number, translateY: number) {
	canvasContext.save();

	const centerX = getRelativeX(drawX) + (drawSizeX * canvasScale) / 2;
	const centerY = getRelativeY(drawY) + (drawSizeY * canvasScale) / 2;

	canvasContext.translate(centerX, centerY);

	const radians = (rotatedDegrees * Math.PI) / 180;
	canvasContext.rotate(radians);

	canvasContext.translate(translateX * canvasScale, translateY * canvasScale);

	canvasContext.drawImage(
		image,
		- (drawSizeX * canvasScale) / 2,
		- (drawSizeY * canvasScale) / 2,
		drawSizeX * canvasScale,
		drawSizeY * canvasScale
	);

	canvasContext.restore();
}

export function drawImage(image: HTMLImageElement, drawX: number, drawY: number, drawSizeX: number, drawSizeY: number) {
	canvasContext.drawImage(image, drawX * canvasScale, drawY * canvasScale, drawSizeX * canvasScale, drawSizeY * canvasScale);
}

export function drawText(content: string, color: string, drawX: number, drawY: number) {
	canvasContext.font = "16px BabelStoneFlags";
	canvasContext.fillStyle = color;
	canvasContext.textAlign = "center";
	canvasContext.fillText(content, drawX, drawY);
}

export function drawTextRelative(content: string, color: string, drawX: number, drawY: number) {
	drawText(content, color, getRelativeX(drawX), getRelativeY(drawY));
}

export function drawCircleRelative(x: number, y: number, diameter: number, color: string) {
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(getRelativeX(x), getRelativeY(y), diameter / 2 * canvasScale, 0, 2 * Math.PI);
	canvasContext.fill();
}

export function drawLine(startX: number, startY: number, endX: number, endY: number, width: number, color: string) {
	canvasContext.beginPath();
	canvasContext.moveTo(startX, startY);
	canvasContext.lineTo(endX, endY);
	canvasContext.lineWidth = width;
	canvasContext.strokeStyle = color;
	canvasContext.stroke();
}

function getRelativeX(x: number): number {
	return (x - clientPlayerEntity.posX + renderScaleX / 2) * canvasScale;
}

function getRelativeY(y: number): number {
	return (y - clientPlayerEntity.posY + renderScaleY / 2) * canvasScale;
}

export function clearCanvas() {
	canvasContext.fillStyle = "#044";
	canvasContext.fillRect(0, 0, 9999, 9999);
}
