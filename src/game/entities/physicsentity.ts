import { SpriteEntity } from "./spriteentity";
import { tileMap, getTileValue } from "../mapmanager";
import { drawImageRelative } from "../render/renderingmanager";
import { getBearing, getIntersection } from "../util";
import { mousePos } from "../inputtracker";

type PhysicsSlopeTilesDict = {
	[key: string]: number;
}

let physicsSlopeTilesDict: PhysicsSlopeTilesDict = {
	"11": 7,
	"-11": 6,
	"1-1": 8,
	"-1-1": 9,
}

type PhysicsSlopePointsDict = {
	[key: number]: number[][];
}

let physicsSlopePointsDict: PhysicsSlopePointsDict = {
	1: [[1, 1], [0, 0]],
	2: [[1, 0], [0, 1]],
	3: [[0, 0], [1, 1]],
	4: [[0, 1], [1, 0]],
}

type PhysicsSlopeBearingsDict = {
	[key: number]: number;
}

let physicsSlopeBearingsDict: PhysicsSlopeBearingsDict = {
	1: 45,
	2: 135,
	3: -135,
	4: -45,
}

export class PhysicsEntity extends SpriteEntity {
	velocityX: number;
	velocityY: number;
	canJump = false;
	canWallJumpOnSide = 0; // 0 = cannot, 1 = right side, -1 = left side

	constructor(
		posX: number,
		posY: number,
		diameter: number,
		spriteSrc: string,
	) {
		super(posX, posY, diameter, spriteSrc);
		this.velocityX = 0;
		this.velocityY = 0;
	}

	tick(): void {
		this.doMovement();
		this.checkInMapBounds();
	};

	doMovement() {
		this.velocityY += 0.01;

		if (Math.abs(this.velocityX) < 0.00001) {
			this.velocityX = 0;
		}
		if (Math.abs(this.velocityY) < 0.00001) {
			this.velocityY = 0;
		}

		this.velocityX = Math.min(this.diameter / 2, Math.abs(this.velocityX)) * Math.sign(this.velocityX);
		this.velocityY = Math.min(this.diameter / 2, Math.abs(this.velocityY)) * Math.sign(this.velocityY);

		this.posX += this.velocityX;
		this.posY += this.velocityY;

		for (let pass = 0; pass < 2; pass++) { // there is probably a less wasteful solution
			for (let sideX = -1; sideX <= 1; sideX++) {
				for (let sideY = -1; sideY <= 1; sideY++) {
					if (Math.abs(sideX) != Math.abs(sideY)) {
						let checkX = this.posX + this.diameter / 2 * sideX;
						let checkY = this.posY + this.diameter / 2 * sideY;
						let tileValue = getTileValue(checkX, checkY);
						if (tileValue > 0 && tileValue <= 5) { // all full square tiles
							let collX = Math.floor(this.posX + this.diameter / 2 * sideX) + (sideX - 1) / -2;
							let collY = Math.floor(this.posY + this.diameter / 2 * sideY) + (sideY - 1) / -2;
							if (
								pass == 1 ||
								(pass == 0 &&
									(sideX != 0 && Math.abs(this.velocityX) > Math.abs(this.velocityY) ||
									 sideY != 0 && Math.abs(this.velocityY) > Math.abs(this.velocityX))
								)
							) {
								this.collide(collX, collY, sideX, sideY);
							}
						}
					}
				}
			}
		}

		for (let sideX = -1; sideX <= 1; sideX++) {
			for (let sideY = -1; sideY <= 1; sideY++) {
				if (Math.abs(sideX) == Math.abs(sideY) && (sideX != 0 && sideY != 0)) {
					let dir = getBearing(this.posX, this.posY, this.posX + sideX, this.posY + sideY);
					let checkX = this.posX + Math.cos(dir) * this.diameter / 2;
					let checkY = this.posY + Math.sin(dir) * this.diameter / 2;
					let tileValue = getTileValue(checkX, checkY);
					if (tileValue >= 6 && tileValue <= 9) { // all slope tiles
						let slopeDictKey = sideX.toString() + sideY.toString();
						let slopeDictVal = physicsSlopeTilesDict[slopeDictKey];
						if (!slopeDictVal) {
							console.log("no slopeDictVal for slopeDictKey " + slopeDictKey);
							continue;
						}
						if (tileValue != slopeDictVal) {
							//console.log("values do not match: " + tileValue + " and " + slopeDictVal);
							continue;
						}
						let slopePoints = physicsSlopePointsDict[slopeDictVal - 5];
						let slopeBearing = physicsSlopeBearingsDict[slopeDictVal - 5];
						if (!slopePoints) {
							console.log("no slope points for slopeDictVal " + slopeDictVal);
							continue;
						}
						let dirRadians = dir * (180 / Math.PI);
						let pointA = Math.floor(checkX) + slopePoints[0][0];
						let pointB = Math.floor(checkY) + slopePoints[0][1];
						let intersection: number[] | null = getIntersection(this.posX, this.posY, dirRadians, pointA, pointB, slopeBearing);
						if (!intersection) {
							console.log("no intersection");
							continue;
						}
						//console.log(dir);
						console.log("player pos: " + this.posX + " " + this.posY + " with sideX sideY of " + sideX + " " + sideY + " with dir " + dirRadians);
						console.log("slope potential collision at point " + intersection[0] + " " + intersection[1] + " with value " + tileValue + " with slopeDictVal " + slopeDictVal + " for node " + checkX + " " + checkY + " with bearing " + slopeBearing + " with points " + slopePoints[0] + " and " + slopePoints[1]);
						let reverseDir = getBearing(this.posX + sideX, this.posY + sideY, this.posX, this.posY);
						this.posX = intersection[0] + Math.cos(reverseDir) / 2 * 1.5;
						this.posY = intersection[1] + Math.sin(reverseDir) / 2 * 1.5;
						this.velocityY = 0;
					}
				}
			}
		}
	}

	collide(collX: number, collY: number, sideX: number, sideY: number) {
		if (sideX != 0) {
			this.posX = collX - sideX * (this.diameter / 2 + 0.001);
			if (this.velocityY > 0.1 && Math.abs(this.velocityX) > 0.1) { // hitting the side of a tile while falling
				this.canWallJumpOnSide = Math.sign(this.velocityX);
			}
			this.velocityX = 0;
			//console.log("new this.posX: " + this.posX);
		}
		else if (sideY != 0) {
			this.posY = collY - sideY * (this.diameter / 2 + 0.001);
			if (this.velocityY > 0) { // hitting the top of a tile rather than the bottom
				this.canJump = true;
			}
			this.velocityY = 0;
			//console.log("new this.posY: " + this.posY);
		}
	}
}
