import { SpriteEntity } from "./spriteentity";
import { tileMap, getTileValue } from "../mapmanager";
import { drawImageRelative } from "../render/renderingmanager";

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
		if (diameter > 1) {
			console.error("entity diameter above 1 breaks collision logic");
			diameter = 1;
		}
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

		if (!this.positionWouldBeInsideTile(this.posX + Math.sign(this.canWallJumpOnSide), this.posY)) {
			this.canWallJumpOnSide = 0;
		}

		if (Math.abs(this.velocityX) < 0.00001) {
			this.velocityX = 0;
		}
		if (Math.abs(this.velocityY) < 0.00001) {
			this.velocityY = 0;
		}

		if (this.positionWouldBeInsideTile(this.posX + this.velocityX, this.posY)) {
			this.collide(true, false);
		}
		else {
			this.posX += this.velocityX;
		}
		if (this.positionWouldBeInsideTile(this.posX, this.posY + this.velocityY)) {
			this.collide(false, true);
		}
		else {
			this.posY += this.velocityY;
		}
	}

	collide(horizontal: boolean, vertical: boolean) {
		if (horizontal) {
			if (Math.abs(this.velocityX) > 0) {
				this.posX = Math.round(this.posX + this.velocityX) - Math.sign(this.velocityX) * this.diameter / 2 - Math.sign(this.velocityX) * 0.01;
			}
			if (this.velocityY > 0.1 && Math.abs(this.velocityX) > 0.1) { // hitting the side of a tile while falling
				this.canWallJumpOnSide = Math.sign(this.velocityX);
			}
			this.velocityX = 0;
		}
		else {
			if (Math.abs(this.velocityY) > 0) {
				this.posY = Math.round(this.posY + this.velocityY) - Math.sign(this.velocityY) * this.diameter / 2 - Math.sign(this.velocityY) * 0.01;
			}
			if (this.velocityY > 0) { // hitting the top of a tile rather than the bottom
				this.canJump = true;
			}
			this.velocityY = 0;
		}
	}

	checkInMapBounds() {
		if (this.posX < 0) {
			this.posX = 0;
			this.velocityX = 0;
		}
		if (this.posX > tileMap.length) {
			this.posX = tileMap.length;
			this.velocityX = 0;
		}
		if (this.posY < 0) {
			this.posY = 0;
			this.velocityY = 0;
		}
		if (this.posY > tileMap[0].length) {
			this.posY = tileMap[0].length;
			this.velocityY = 0;
		}
	}

	positionWouldBeInsideTile(x: number, y: number): boolean {
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (Math.abs(i) == Math.abs(j)) {
					if (getTileValue(x + i * this.diameter / 2, y + j * this.diameter / 2) > 0) {
						return true;
					}
				}
			}
		}
		return false;
	}
}
