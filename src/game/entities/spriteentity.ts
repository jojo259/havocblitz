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
		console.time("loaded sprite");
		this.loadSprite();
	}

	loadSprite() {
		console.log("loading sprite: " + this.spritePath)
		getSprite(this.spritePath, this.color).then((sprite) => {
			if (sprite) {
				console.log("setting sprite");
				this.sprite = sprite;
				console.timeEnd("loaded sprite");
			}
			else {
				console.error("sprite was null: " + this.spritePath)
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
