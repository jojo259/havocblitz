import { clientPlayerEntity } from "./entitymanager";
import { renderScaleX, renderScaleY } from "../page/canvas";
import { drawImageRelative } from "./render/renderingfuncs";

const tileImage = new Image();
tileImage.src = "./game/sprites/tile.png";
let mapDensity = 40; //Change for more or less density (ranges from 1-100)
let genAmount = 2; //how many cycles to generate
export let mapWidth = 300;
export let mapHeight = 200;
export let currentMapGeneratedTimestamp = Date.now();

export function setCurrentMapGeneratedTimestamp(to: number) {
	currentMapGeneratedTimestamp = to;
}

export function renderMap() {
	let startX = Math.floor(Math.max(0, clientPlayerEntity.posX - renderScaleX / 2));
	let startY = Math.floor(Math.max(0, clientPlayerEntity.posY - renderScaleY / 2));
	let endX = Math.ceil(Math.min(tileMap.length, clientPlayerEntity.posX + renderScaleX / 2)) + 1;
	let endY = Math.ceil(Math.min(tileMap[0].length, clientPlayerEntity.posY + renderScaleY / 2)) + 1;
	for (let [atX, curRow] of tileMap.slice(startX, endX).entries()) {
		for (let [atY, tileValue] of curRow.slice(startY, endY).entries()) {
			if (tileValue == 1) {
				drawImageRelative(tileImage, atX + startX, atY + startY, 1, 1);
			}
		}
	}
}

export function getTileValue(x: number, y: number): number {
	return tileMap?.[Math.floor(x)]?.[Math.floor(y)] ?? 0;
}

function generateMap(width: number, height: number): number[][] {
	let mapArray: number[][] = [];
	for(let i = 0; i < width; i++){
		mapArray[i] = [];
		for(let j = 0; j < height; j++){
			mapArray[i][j] = 0;
		}
	}
	mapArray = generateNoise(mapArray);
	mapArray = runCellularAutomaton(mapArray);
	return mapArray;
}

function generateNoise(mapArray: number[][]): number[][] {
	let width = mapArray.length;
	let height = mapArray[0].length;
	for(let i = 1; i < width - 1; i++) {
		for(let j = 1; j < height - 1; j++) {
			let random = Math.floor(Math.random() * 100);
			if(random > mapDensity) {
				mapArray[i][j] = 0;
			}
			if(random <= mapDensity) {
				mapArray[i][j] = 1;
			}
		}
	}
	return mapArray;
}

function runCellularAutomaton(mapArray: number[][]): number[][] {
	let width = mapArray.length;
	let height = mapArray[0].length;
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
					mapArray[j][k] = 1;
				}
				else {
					mapArray[j][k] = 0;
				}
			}
		}
	}
	return mapArray;
}

export let tileMap = generateMap(mapWidth, mapHeight);
