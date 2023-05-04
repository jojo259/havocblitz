import { clientPlayerEntity } from "./entitymanager";
import { renderScaleX, renderScaleY } from "../page/canvas";
import { drawImageRelative } from "./renderer";

const tileImage = new Image();
tileImage.src = "./game/sprites/tile.png";
let mapDensity = 40; //Change for more or less density (ranges from 1-100)
let genAmount = 2; //how many cycles to generate

export function renderMap() {
	let startX = Math.floor(Math.max(0, clientPlayerEntity.posX - renderScaleX / 2));
	let startY = Math.floor(Math.max(0, clientPlayerEntity.posY - renderScaleY / 2));
	let endX = Math.ceil(Math.min(tileMap[0].length, clientPlayerEntity.posX + renderScaleX / 2)) + 1;
	let endY = Math.ceil(Math.min(tileMap.length, clientPlayerEntity.posY + renderScaleY / 2)) + 1;
	for (let [atY, curRow] of tileMap.slice(startY, endY).entries()) {
		for (let [atX, tileValue] of curRow.slice(startX, endX).entries()) {
			if (tileValue == 1) {
				drawImageRelative(tileImage, atX + startX, atY + startY, 1, 1);
			}
		}
	}
}

export function getTileValue(x: number, y: number): number {
	return tileMap?.[Math.floor(y)]?.[Math.floor(x)] ?? 1;
}

export function generateMap(x: number, y: number): number[][] {
	let mapArray: number[][] = [];
	console.log(mapArray);
	for(let i = 0; i < y; i++){
		mapArray[i] = [];
		//console.log(mapArray[i]);
		for(let j = 0; j < x; j++){
			//console.log(mapArray[i][j]);
			mapArray[i][j] = 1;
		}
	}
	console.log(mapArray.length);
	console.log(mapArray[0].length);
	//return mapArray;
	return generateNoise(mapArray, x, y);
}

export function generateNoise(mapArray: number[][], x: number, y: number): number[][] {
	for(let i = 1; i < y-1; i++){
		for(let j = 1; j < x-1; j++){
			let random = Math.floor(Math.random() * 100);
			if(random > mapDensity){
				mapArray[i][j] = 0;
			}
			if(random <= mapDensity){
				mapArray[i][j] = 1;
			}
		}
	}
	//return mapArray;
	return generate(mapArray, x, y);
}

export function generate(mapArray: number[][], width: number, height: number): number[][]{ 
	//let tempArray: number[][] = [];
	for(let i = 0; i < genAmount; i++){
		let tempArray = mapArray.map(inner => inner.slice());
		/*
		for(let t = 0; t < mapArray.length; t++){
			tempArray[t] = mapArray[t].slice();
		}*/
		for(let j = 1; j < width-1; j++){
			for(let k = 1; k < height-1; k++){
				let neighbour_walls = 0;
				for(let x = j-1; x < j+2; x++){
					for(let y = k-1; y < k+2; y++){
						if(y != j && x != k){
							if(tempArray[y][x] == 1){
								neighbour_walls++;
							}
						}
					}
				}
				if(neighbour_walls > 4){
					mapArray[k][j] = 1;
				}
				else{
					mapArray[k][j] = 0;
				}
			}
		}
	}
	return mapArray;
}

export let tileMap = generateMap(300, 200);

/*
export let tileMap: number[][] = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
	[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1],
	[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1],
	[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];*/
