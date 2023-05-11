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
						if (getTileValue(checkX, checkY) > 0) {
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
