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
