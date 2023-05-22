import { SpriteEntity } from "./spriteentity";
import { tileMap, getTileValue } from "../mapmanager";
import { getBearing, getIntersection, getDist } from "../util";
import { mousePos } from "../inputtracker";

type TileLines = {
	[key: number]: number[][];
}

let tileLines: TileLines = {
	1: [[0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0]],
	2: [[0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0]],
	3: [[0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0]],
	4: [[0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0]],
	5: [[0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0]],
	6: [[0, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0]],
	7: [[0, 0, 1, 0], [1, 0, 0, 1], [0, 1, 0, 0]],
	8: [[0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 0]],
	9: [[1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 1, 0]],
}

import { drawImageRelative, drawCircleRelative } from "../render/renderingfuncs";

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
		color: number[]
	) {
		if (diameter > 1) {
			console.error("entity diameter above 1 breaks collision logic");
			diameter = 1;
		}
		super(posX, posY, diameter, spriteSrc, color);
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

		this.posX += this.velocityX;
		this.posY += this.velocityY;

		this.checkCollisions();
	}

	draw() {
		drawCircleRelative(this.posX, this.posY, this.diameter, "red");
	}

	checkCollisions() {
		let collisions: any[] = [];
		let startX = Math.floor(Math.max(0, this.posX - 1));
		let startY = Math.floor(Math.max(0, this.posY - 1));
		let endX = Math.ceil(Math.min(tileMap.length, this.posX + 1));
		let endY = Math.ceil(Math.min(tileMap[0].length, this.posY + 1));
		for (let [atX, curRow] of tileMap.slice(startX, endX).entries()) {
			for (let [atY, tileValue] of curRow.slice(startY, endY).entries()) {
				if (tileValue > 0) {
					let tileX = atX + startX;
					let tileY = atY + startY;
					let lines = tileLines[tileValue];
					lines.forEach(line => {
						const result = lineCircle(
							tileX + line[0], tileY + line[1], tileX + line[2], tileY + line[3], this.posX, this.posY, this.diameter / 2
						);
						if (result.collision) {
							collisions.push(result);
							if (result.closest) {
								//console.log(`hit at closestX = ${result.closest.x}, closestY = ${result.closest.y}`);
								drawCircleRelative(result.closest.x, result.closest.y, 0.05, "cyan");
							}
						}
					});
				}
			}
		}

		if (collisions.length > 0) {
			//console.log("collisions: " + collisions.length);
			let closestCollision: any = null;
			let closestCollisionDist = 999;

			collisions.forEach(collision => {
				let collisionDist = getDist(this.posX, this.posY, collision.closest.x, collision.closest.y);
				if (collisionDist < closestCollisionDist) {
					closestCollision = collision;
					closestCollisionDist = collisionDist;
				}
			});
			
			// resolve collision
			if (closestCollision) {
				//console.log("closestCollision:");
				//console.log(closestCollision);
				drawCircleRelative(closestCollision.closest.x, closestCollision.closest.y, 0.1, "blue");
				if (closestCollision.hasOwnProperty("normalBearing")) {
					if (closestCollision.normalBearing != null) {
						//console.log("normalBearing: " + closestCollision.normalBearing);
						let cx = closestCollision.closest.x + Math.cos(closestCollision.normalBearing) * this.diameter / 2 * 1.01;
						let cy = closestCollision.closest.y + Math.sin(closestCollision.normalBearing) * this.diameter / 2 * 1.01;
						//console.log("cx cy: " + cx + " " + cy);
						drawCircleRelative(cx, cy, 0.1, "cyan");
						this.posX = cx;
						this.posY = cy;
						this.velocityX = 0;
						this.velocityY = 0;
					}
				}
			}
		}
	}
}

function lineCircle(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	cx: number,
	cy: number,
	r: number
): { collision: boolean, closest: { x: number, y: number } | null, normalBearing: (number | null) } {
	
	let lineBearing = getBearing(x1, y1, x2, y2);

	const distX = x1 - x2;
	const distY = y1 - y2;
	const len = Math.sqrt(distX * distX + distY * distY);

	const dot = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / Math.pow(len, 2);

	const closestX = x1 + dot * (x2 - x1);
	const closestY = y1 + dot * (y2 - y1);

	const onSegment = linePoint(x1, y1, x2, y2, closestX, closestY);
	if (!onSegment) {
		const inside1 = pointCircle(x1, y1, cx, cy, r);
		const inside2 = pointCircle(x2, y2, cx, cy, r);
		if (inside1 || inside2) {
			let normalBearing = getBearing(x1, y1, cx, cy);
			let closest = { x: x1, y: y1 };
			if (inside2) {
				closest = { x: x2, y: y2 }
				normalBearing = getBearing(x2, y2, cx, cy);
			}
			return { collision: true, closest: closest, normalBearing: normalBearing };
		}
		return { collision: false, closest: { x: closestX, y: closestY }, normalBearing: null };
	}

	const distXClosest = closestX - cx;
	const distYClosest = closestY - cy;
	const distance = Math.sqrt(distXClosest * distXClosest + distYClosest * distYClosest);

	if (distance <= r) {
		let normalBearing = lineBearing - degToRad(90);
		const overlap = r - distance;
		return { collision: true, closest: { x: closestX, y: closestY }, normalBearing: normalBearing };
	}

	return { collision: false, closest: { x: closestX, y: closestY }, normalBearing: 0 };
}


function pointCircle(px: number, py: number, cx: number, cy: number, r: number): boolean {
	const distX = px - cx;
	const distY = py - cy;
	const distance = Math.sqrt(distX * distX + distY * distY);

	if (distance <= r) {
		return true;
	}

	return false;
}

function linePoint(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	px: number,
	py: number
): boolean {
	const d1 = dist(px, py, x1, y1);
	const d2 = dist(px, py, x2, y2);

	const lineLen = dist(x1, y1, x2, y2);

	const buffer = 0.1;

	if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
		return true;
	}

	return false;
}

function dist(x1: number, y1: number, x2: number, y2: number): number {
	const distX = x1 - x2;
	const distY = y1 - y2;
	return Math.sqrt(distX * distX + distY * distY);
}

const degToRad = (deg: number): number => {
  return deg * (Math.PI / 180.0);
};
