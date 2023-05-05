import { drawImageRelativeCircular } from "../renderer";

export abstract class Entity {
	posX: number;
	posY: number;
	diameter: number;
	sprite: HTMLImageElement;
	initializedAt = Date.now();

	constructor(
		posX: number,
		posY: number,
		diameter: number,
		spriteSrc: string
	) {
		this.posX = posX;
		this.posY = posY;
		this.diameter = diameter;
		this.sprite = new Image();
		this.sprite.src = spriteSrc;
	}

	draw() {
		drawImageRelativeCircular(this.sprite, this.posX, this.posY, this.diameter);
	}

	abstract tick(): void;
}
