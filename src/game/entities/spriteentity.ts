import { Entity } from "./entity";
import { drawImageRelativeCircular } from "../render/renderingmanager";
import { getSprite } from "../render/spritemanager";

export class SpriteEntity extends Entity {

	sprite: HTMLImageElement | null = null;
	color: number[] = [0, 0, 0];
	spritePath: string;

	constructor(posX: number, posY: number, diamater: number, spritePath: string, color: number[]) {
		super(posX, posY, diamater);
		this.spritePath = spritePath;
		this.color = color;
		this.loadSprite();
	}

	loadSprite() {
		getSprite(this.spritePath, this.color).then((sprite) => {
			if (sprite) {
				this.sprite = sprite;
			}
			else {
				console.error("sprite was null for: " + this.spritePath);
			}
		})
	}

	tick() {

	}

	draw() {
		if (this.sprite instanceof HTMLImageElement) {
			drawImageRelativeCircular(this.sprite, this.posX, this.posY, this.diameter);
		}
	}
}
