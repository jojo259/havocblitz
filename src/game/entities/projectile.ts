import { PhysicsEntity } from "./physicsentity";
import { spawnParticlesAtPoint } from "../render/particlespawner";
import { drawImageRelativeCircularRotated } from "../render/renderingfuncs";
import { entityList } from "../entitymanager";
import { getDist, getBearing } from "../util";
import { Player } from "./player";

export class Projectile extends PhysicsEntity {

	drawDiameter: number;

	constructor(posX: number, posY: number, diameter: number, drawDiameter: number, velocityX: number, velocityY: number, spriteSrc: string, color: number[]) {
		super(posX, posY, diameter, spriteSrc, color);
		this.velocityX = velocityX;
		this.velocityY = velocityY;
		this.drawDiameter = drawDiameter;
	}

	tick() {
		super.tick();
	}

	draw() {
		let projectileBearing = Math.atan2(this.velocityY, this.velocityX);
		if (this.sprite) {
			drawImageRelativeCircularRotated(this.sprite, this.posX, this.posY, this.drawDiameter, projectileBearing * (180 / Math.PI));
		}
	}
}
