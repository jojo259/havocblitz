import { mapWidth, mapHeight, tileMap } from "../mapmanager";
import { entityList } from "../entitymanager";

export abstract class Entity {
	posX: number;
	posY: number;
	diameter: number;
	initializedAt = Date.now();

	constructor(
		posX: number,
		posY: number,
		diameter: number,
	) {
		this.posX = posX;
		this.posY = posY;
		this.diameter = diameter;
	}

	abstract draw(): void;

	abstract tick(): void;

	destroy() {
		entityList.splice(entityList.indexOf(this), 1);
	}

	findSpawn(): void {
		for (let i = 0; i < 8192; i++) {
			let newPosX = 0;
			let newPosY = 0;
			while(newPosX == 0 || newPosX == mapWidth || newPosY == 0 || newPosY == mapHeight){
				newPosX = Math.floor(Math.random() * mapWidth);
				newPosY = Math.floor(Math.random() * mapHeight);
			}
			let wallFound = false;
			for(let x = newPosX-1; x <= newPosX+1; x++){
				for(let y = newPosY-1; y <= newPosY+1; y++){
					if(tileMap[x][y] != 0){
						wallFound = true;
					}
				}
			}
			if (wallFound) {
				continue;
			}
			this.posX = newPosX;
			this.posY = newPosY;
			console.log("found spawn");
			return;
		}
		console.warn("failed to find spawn");
	}
}
