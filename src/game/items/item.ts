import { Player } from "../entities/player";
import { drawImage } from "../render/renderingfuncs";

export abstract class Item {

	sprite: HTMLImageElement;

	constructor(spriteSrc: any) {
		this.sprite = new Image();
		this.sprite.src = spriteSrc;
	}

	abstract use(player: Player, mousePos: {[key: string]: number}): void;
	
	draw(atX: number, atY: number, scale: number) {
		drawImage(this.sprite, atX, atY, scale, scale);
	}
}
