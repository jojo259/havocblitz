import { SpriteEntity } from "./spriteentity";
import { tileMap, getTileValue, tilePoints } from "../mapmanager";
import { getBearing, getDist } from "../util";
import { mousePos } from "../inputtracker";
import { drawImageRelative, drawCircleRelative, drawLineRelative } from "../render/renderingfuncs";
import { debugVisualsEnabled } from "../render/renderer";

let bounceMult = 0.8;

type TileLines = {
	[key: number]: number[][];
}

let tileLines: TileLines = []

// pre-process tile points into lines for collision calculations
Object.keys(tilePoints).forEach((value: string, i: number, array: string[]) => {
	const points = tilePoints[i + 1];
	let line = [];
	for (let [o, point] of points.entries()) {
		let nextPoint;
		if (o < points.length - 1) {
			nextPoint = points[o + 1];
		}
		else {
			nextPoint = points[0];
		}
		line.push([point[0], point[1], nextPoint[0], nextPoint[1]]);
	}
	tileLines[i + 1] = line;
});

export class PhysicsEntity extends SpriteEntity {
	velocityX: number;
	velocityY: number;

	constructor(
		posX: number,
		posY: number,
		diameter: number,
		spriteSrc: string,
		color: number[]
	) {
		super(posX, posY, diameter, spriteSrc, color);
		this.velocityX = 0;
		this.velocityY = 0;
	}

	tick(): void {
		this.posY += 0.01;
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

	checkCollisions() {
		let collisionsSquareSideLengthHalved = this.diameter / 2;
		let collisions: any[] = [];
		let startX = Math.floor(Math.max(0, this.posX - collisionsSquareSideLengthHalved));
		let startY = Math.floor(Math.max(0, this.posY - collisionsSquareSideLengthHalved));
		let endX = Math.ceil(Math.min(tileMap.length, this.posX + collisionsSquareSideLengthHalved));
		let endY = Math.ceil(Math.min(tileMap[0].length, this.posY + collisionsSquareSideLengthHalved));
		for (let [atX, curRow] of tileMap.slice(startX, endX).entries()) {
			for (let [atY, tileValue] of curRow.slice(startY, endY).entries()) {
				if (tileValue > 0) {
					let tileX = atX + startX;
					let tileY = atY + startY;
					let lines = tileLines[tileValue];
					lines.forEach(line => {
						const result = lineCircle(
							tileX + line[0], tileY + line[1], tileX + line[2], tileY + line[3], this.posX, this.posY, this.diameter / 2, this.velocityX, this.velocityY
						);
						if (result.collision) {
							collisions.push(result);
						}
					});
				}
			}
		}

		if (collisions.length > 0) {
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
				if (debugVisualsEnabled) {
					drawLineRelative(this.posX, this.posY, closestCollision.closest.x, closestCollision.closest.y, 0.05, "cyan");
					drawCircleRelative(closestCollision.closest.x, closestCollision.closest.y, 0.1, "blue");
				}
				if (closestCollision.hasOwnProperty("normalBearing")) {
					if (closestCollision.normalBearing != null) {
						let cx = closestCollision.closest.x + Math.cos(closestCollision.normalBearing) * this.diameter / 2 * 1.01;
						let cy = closestCollision.closest.y + Math.sin(closestCollision.normalBearing) * this.diameter / 2 * 1.01;
						this.posX = cx;
						this.posY = cy;
						if (closestCollision.newVelocity) {
							this.velocityX = closestCollision.newVelocity.x * bounceMult;
							this.velocityY = closestCollision.newVelocity.y * bounceMult;
						}
						else {
							console.error("missing closestCollision.newVelocity");
						}
						this.collide(closestCollision.closest.x, closestCollision.closest.y, radToDeg(closestCollision.lineBearing));
					}
				}
			}
		}
	}

	collide (collX: number, collY: number, bearingDeg: number) {

	}
}

function lineCircle(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	cx: number,
	cy: number,
	r: number,
	vx: number,
	vy: number
): { collision: boolean, closest: { x: number, y: number } | null, lineBearing: (number | null), normalBearing: (number | null), newVelocity: { x: number, y: number } | null } {
	
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
			let newVelocity = dotProduct(normalBearing, vx, vy);
			return { collision: true, closest: closest, lineBearing: lineBearing, normalBearing: normalBearing, newVelocity: newVelocity };
		}
		return { collision: false, closest: { x: closestX, y: closestY }, lineBearing: lineBearing, normalBearing: null, newVelocity: null };
	}

	const distXClosest = closestX - cx;
	const distYClosest = closestY - cy;
	const distance = Math.sqrt(distXClosest * distXClosest + distYClosest * distYClosest);

	if (distance <= r) {
		let normalBearing = lineBearing - degToRad(90);
		const overlap = r - distance;

		let newVelocity = dotProduct(normalBearing, vx, vy);

		return { collision: true, closest: { x: closestX, y: closestY }, lineBearing: lineBearing, normalBearing: normalBearing, newVelocity: newVelocity};
	}

	return { collision: false, closest: { x: closestX, y: closestY }, lineBearing: lineBearing, normalBearing: 0, newVelocity: null };
}

function dotProduct(normalBearing: number, vx: number, vy: number) {
	let nx = Math.cos(normalBearing);
	let ny = Math.sin(normalBearing);

	let dotProduct = vx * nx + vy * ny;
	let newVelocityX = vx - 2 * dotProduct * nx;
	let newVelocityY = vy - 2 * dotProduct * ny;

	return {x: newVelocityX, y: newVelocityY};
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
	const d1 = getDist(px, py, x1, y1);
	const d2 = getDist(px, py, x2, y2);

	const lineLen = getDist(x1, y1, x2, y2);

	const buffer = 0.1;

	if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
		return true;
	}

	return false;
}

const degToRad = (deg: number): number => {
	return deg * (Math.PI / 180.0);
};

const radToDeg = (rad: number) => {
	return rad * (180.0 / Math.PI);
};
