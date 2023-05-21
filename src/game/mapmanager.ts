import { clientPlayerEntity } from "./entitymanager";
import { renderScaleX, renderScaleY } from "../page/canvas";
import { drawImageRelative, drawTextRelative, drawImageRelativeRotated, drawImageRelativeRotatedTranslated } from "./render/renderingmanager";

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
			let tileX = atX + startX;
			let tileY = atY + startY;
			if (tileValue == 1) {
				drawImageRelative(tileImage, tileX, tileY, 1, 1);
			}
			if (tileValue >= 2 && tileValue <= 5) {
				let rotatedDegrees = 90 * (tileValue - 2);
				drawImageRelativeRotated(tileImage, tileX, tileY, 1, 1, rotatedDegrees);
			}
			if (tileValue >= 6 && tileValue <= 9) {
				let rotatedDegrees = (tileValue - 6) * 90 + 45;
				drawImageRelativeRotatedTranslated(tileImage, tileX, tileY, 1, 1, rotatedDegrees, (Math.sqrt(2) - 1) / 2, 0.5);
				drawImageRelativeRotatedTranslated(tileImage, tileX, tileY, 1, 1, rotatedDegrees, -(Math.sqrt(2) - 1) / 2, 0.5);
			}
		}
	}
	for (let [atX, curRow] of tileMap.slice(startX, endX).entries()) {
		for (let [atY, tileValue] of curRow.slice(startY, endY).entries()) {
			if (tileValue > 0) {
				let tileX = atX + startX;
				let tileY = atY + startY;
				drawTextRelative(tileValue.toString(), "black", tileX + 0.5, tileY + 0.6);
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
	mapArray = pruneMap(mapArray);
	mapArray = slopifyMap(mapArray);
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
							neighborWalls += mapArray[x][y];
						}
					}
				}
				if (neighborWalls > 4) {
					tempArray[j][k] = 1;
				}
				else {
					tempArray[j][k] = 0;
				}
			}
		}
		mapArray = tempArray;
	}
	return mapArray;
}

function pruneMap(mapArray: number[][]): number[][] {
	let width = mapArray.length;
	let height = mapArray[0].length;
	for(let pass = 1; pass <= 64; pass++) {
		let prunedCount = 0;
		for(let x = 2; x < width - 2; x++) {
			for(let y = 2; y < height - 2; y++) {
				if (mapArray[x][y] == 1) {
					let farNeighbors = 0;
					for (let i = -1; i <= 1; i++){
						for (let j = -1; j <= 1; j++){
							if (i != 0 || j != 0){
								if (mapArray[x + i][y + j] == 1) {
									farNeighbors += 1;
								}
							}
						}
					}
					let touchingNeighbors = 0; // here, neighbors are only in the 4 main directions, no diagonals
					for (let i = -1; i <= 1; i++){
						for (let j = -1; j <= 1; j++){
							if (Math.abs(i) != Math.abs(j)){
								if (mapArray[x + i][y + j] == 1) {
									touchingNeighbors += 1;
								}
							}
						}
					}
					if (touchingNeighbors <= 1){// || (touchingNeighbors <= 2 && farNeighbors <= 2) || (false)) {
						mapArray[x][y] = 0;
						prunedCount++;
					}
				}
			}
		}
		if (prunedCount == 0) {
			console.log("done pruning");
			break;
		}
		console.log("pruned: " + prunedCount);
	}
	return mapArray;
}

type SlopeDict = {
	[key: string]: number;
}

let slopeDict: SlopeDict = {
	"1111": 1,
	"1011": 2,
	"1110": 3,
	"1101": 4,
	"0111": 5,
	"1010": 6,
	"1100": 7,
	"0101": 8,
	"0011": 9,
}

function slopifyMap(mapArray: number[][]): number[][] {
	let width = mapArray.length;
	let height = mapArray[0].length;
	for(let x = 1; x < width - 1; x++) {
		for(let y = 1; y < height - 1; y++) {
			if (mapArray[x][y] == 1) {
				let neighborsString = "";
				for (let i = -1; i <= 1; i++){
					for (let j = -1; j <= 1; j++){
						if (Math.abs(i) != Math.abs(j)){
							if (mapArray[x + i][y + j] == 0) {
								neighborsString += "0";
							}
							else {
								neighborsString += "1";
							}
						}
					}
				}
				if (slopeDict.hasOwnProperty(neighborsString)) {
					mapArray[x][y] = slopeDict[neighborsString];
				}
			}
		}
	}

	return mapArray;
}

export let tileMap = generateMap(mapWidth, mapHeight);
