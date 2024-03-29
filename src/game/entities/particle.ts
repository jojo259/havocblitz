import { Entity } from "./entity";
import { drawCircleRelative } from "../render/renderingfuncs";
import { debugVisualsEnabled } from "../render/renderer";

export class Particle extends Entity {

	velocityX: number;
	velocityY: number;
	color: string;
	aliveTimeMs: number;

	constructor(
		posX: number,
		posY: number,
		diameter: number,
		velocityX: number,
		velocityY: number,
		aliveTimeMs: number,
		color: string,
	) {
		super(posX, posY, diameter);
		this.velocityX = velocityX;
		this.velocityY = velocityY;
		this.color = color;
		this.aliveTimeMs = aliveTimeMs;
	}

	tick() {
		this.posX += this.velocityX;
		this.posY += this.velocityY;
		if (Date.now() > this.initializedAt + this.aliveTimeMs) {
			this.destroy();
		}
	}

	draw() {
		if (!debugVisualsEnabled) {
			drawCircleRelative(this.posX, this.posY, this.diameter, this.color);
		}
	}
}
