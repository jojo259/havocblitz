import { drawImageRelativeCircular } from "../renderer";

export abstract class Entity {
	posX: number;
	posY: number;
	radius: number;
	sprite: HTMLImageElement;

	constructor(
		posX: number,
		posY: number,
		radius: number,
		spriteSrc: string
	) {
		this.posX = posX;
		this.posY = posY;
		this.radius = radius;
		this.sprite = new Image();
		this.sprite.src = spriteSrc;
	}

	draw() {
		drawImageRelativeCircular(this.sprite, this.posX, this.posY, this.radius);
	}

	abstract tick(): void;
}
