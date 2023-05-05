import { clientPlayerEntity } from "./entitymanager";
import { renderScaleX, renderScaleY } from "../page/canvas";
import { drawImageRelative } from "./renderer";

const tileImage = new Image();
tileImage.src = "./game/sprites/tile.png";
let mapDensity = 40; //Change for more or less density (ranges from 1-100)
let genAmount = 2; //how many cycles to generate
export let mapWidth = 300;
export let mapHeight = 200;

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

function generateMap(width: number, height: number): number[][] {
	let mapArray: number[][] = [];
	for(let i = 0; i < width; i++){
		mapArray[i] = [];
		for(let j = 0; j < height; j++){
			mapArray[i][j] = 1;
		}
	}
	return generateNoise(mapArray, width, height);
}

function generateNoise(mapArray: number[][], width: number, height: number): number[][] {
	for(let i = 1; i < height - 1; i++) {
		for(let j = 1; j < width - 1; j++) {
			let random = Math.floor(Math.random() * 100);
			if(random > mapDensity) {
				mapArray[i][j] = 0;
			}
			if(random <= mapDensity) {
				mapArray[i][j] = 1;
			}
		}
	}
	return runCellularAutomaton(mapArray, width, height);
}

function runCellularAutomaton(mapArray: number[][], width: number, height: number): number[][] { 
	for (let i = 0; i < genAmount; i++){
		let tempArray = mapArray.map(inner => inner.slice());
		for (let j = 1; j < width - 1; j++){
			for (let k = 1; k < height - 1; k++){
				let neighborWalls = 0;
				for (let x = j-1; x < j+2; x++){
					for (let y = k-1; y < k+2; y++){
						if (y != j && x != k){
							neighborWalls += tempArray[x][y];
						}
					}
				}
				if (neighborWalls > 4) {
					mapArray[k][j] = 1;
				}
				else {
					mapArray[k][j] = 0;
				}
			}
		}
	}
	return mapArray;
}

export let tileMap = generateMap(mapWidth, mapHeight);
