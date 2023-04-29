import { Entity } from "./entity";

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
		this.velocityY += 1;

		this.velocityX = Math.sign(this.velocityX) * Math.min(Math.abs(this.velocityX), this.maximumVelocityX);
		this.velocityY = Math.sign(this.velocityY) * Math.min(Math.abs(this.velocityY), this.maximumVelocityY);

		this.posX += this.velocityX;
		//this.posY += this.velocityY;
	};
}
