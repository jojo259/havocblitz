import { Entity } from "./entity";
import { tileMap } from "../mapmanager";

export class PhysicsEntity extends Entity {
	velocityX: number;
	velocityY: number;
	maximumVelocityX: number;
	maximumVelocityY: number;

	constructor(
		posX: number,
		posY: number,
		maximumVelocityX: number,
		maximumVelocityY: number,
		radius: number,
		spriteSrc: string,
	) {
		super(posX, posY, radius, spriteSrc);
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
		this.velocityX *= 0.9;
		this.velocityY += 0.01;

		this.velocityX = Math.sign(this.velocityX) * Math.min(Math.abs(this.velocityX), this.maximumVelocityX);
		this.velocityY = Math.sign(this.velocityY) * Math.min(Math.abs(this.velocityY), this.maximumVelocityY);

		this.posX += this.velocityX;
		this.posY += this.velocityY;
	}

	checkInMapBounds() {
		if (this.posX < 0) {
			this.posX = 0;
			this.velocityX = 0;
		}
		if (this.posX > tileMap[0].length) {
			this.posX = tileMap[0].length;
			this.velocityX = 0;
		}
		if (this.posY < 0) {
			this.posY = 0;
			this.velocityY = 0;
		}
		if (this.posY > tileMap.length) {
			this.posY = tileMap.length;
			this.velocityY = 0;
		}
	}
}
