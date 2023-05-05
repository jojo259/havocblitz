import { drawImageRelativeCircular } from "../renderer";
import { mapWidth, mapHeight, tileMap } from "../mapmanager";

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
		if (diameter > 1) {
			console.error("entity diameter above 1 breaks collision logic");
			this.diameter = 1;
		}
	}

	draw() {
		drawImageRelativeCircular(this.sprite, this.posX, this.posY, this.diameter);
	}

	abstract tick(): void;

	findSpawn(): void {
		while(true){
			let wallFound = false
			let newPosX = Math.floor(Math.random() * mapWidth);
			let newPosY = Math.floor(Math.random() * mapHeight);
			while((newPosX == (0 || mapWidth)) || (newPosY == (0 || mapHeight))){
				newPosX = Math.floor(Math.random() * mapWidth);
				newPosY = Math.floor(Math.random() * mapHeight);
			}
			for(let x = newPosX-1; x < newPosX+2; x++){
				for(let y = newPosY-1; y < newPosY+1; y++){
					if(tileMap[y][x] == 1){
						wallFound = true;
					}
				}
			}
			if(wallFound){
				continue;
			}
			else{
				this.posX = newPosX;
				this.posY = newPosY;
				return;
			}
		}
	}
}
