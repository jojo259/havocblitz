import { Entity } from "./entity";
import { tileMap, getTileValue } from "../mapmanager";
import { drawImageRelative } from "../renderer";

export class PhysicsEntity extends Entity {
	velocityX: number;
	velocityY: number;
	maximumVelocityX: number;
	maximumVelocityY: number;
	canJump = false;

	constructor(
		posX: number,
		posY: number,
		maximumVelocityX: number,
		maximumVelocityY: number,
		diameter: number,
		spriteSrc: string,
	) {
		super(posX, posY, diameter, spriteSrc);
		this.velocityX = 0;
		this.velocityY = 0;
		this.maximumVelocityX = maximumVelocityX;
		this.maximumVelocityY = maximumVelocityY;
	}

	tick(): void {
		this.doMovement();
		this.checkInMapBounds();
	};

	doMovement() {
		this.velocityX *= 0.8;
		this.velocityY += 0.01;

		if (Math.abs(this.velocityX) < 0.00001) {
			this.velocityX = 0;
		}
		if (Math.abs(this.velocityY) < 0.00001) {
			this.velocityY = 0;
		}

		this.velocityX = Math.sign(this.velocityX) * Math.min(Math.abs(this.velocityX), this.maximumVelocityX);
		this.velocityY = Math.sign(this.velocityY) * Math.min(Math.abs(this.velocityY), this.maximumVelocityY);

		let nextPosX = this.posX + this.velocityX;
		if (this.positionWouldBeInsideTile(this.posX + this.velocityX, this.posY)) {
			this.velocityX = 0;
		}
		else {
			this.posX += this.velocityX;
		}
		let nextPosY = this.posY + this.velocityY;
		if (this.positionWouldBeInsideTile(this.posX, this.posY + this.velocityY)) {
			if (this.velocityY > 0) {
				this.canJump = true;
			}
			this.velocityY = 0;
		}
		else {
			this.posY += this.velocityY;
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