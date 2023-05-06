import { Entity } from "./entity";
import { drawImageRelativeCircular } from "../render/renderingmanager";

export class SpriteEntity extends Entity {

	sprite: HTMLImageElement;

	constructor(posX: number, posY: number, diamater: number, spriteSrc: string) {
		super(posX, posY, diamater);
		this.sprite = new Image();
		this.sprite.src = spriteSrc;
	}

	tick() {

	}

	draw() {
		drawImageRelativeCircular(this.sprite, this.posX, this.posY, this.diameter);
	}
}
