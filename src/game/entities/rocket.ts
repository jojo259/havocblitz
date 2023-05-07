import { PhysicsEntity } from "./physicsentity";
import { spawnParticlesAtPoint } from "../render/particlespawner";
import { drawImageRelativeCircularRotated } from "../render/renderingmanager";

export let rocketSpeed = 0.5;

export class Rocket extends PhysicsEntity {

	constructor(posX: number, posY: number, velocityX: number, velocityY: number) {
		super(posX, posY, 99, 99, 0.8, "./game/sprites/rocket.png");
		this.velocityX = velocityX;
		this.velocityY = velocityY;
	}

	tick() {
		super.tick();
	}

	draw() {
		let rocketBearing = Math.atan2(this.velocityY, this.velocityX);
		drawImageRelativeCircularRotated(this.sprite, this.posX, this.posY, this.diameter, rocketBearing * (180 / Math.PI));
		spawnParticlesAtPoint(this.posX - this.velocityX, this.posY - this.velocityY, 8, 0.1, 0.5, 0.1, 0.1, 100, ["#f00", "#f90", "#ff0"]);
	}

	collide(horizontal: boolean, vertical: boolean) {
		this.destroy();
		spawnParticlesAtPoint(this.posX - this.velocityX, this.posY - this.velocityY, 64, 0.1, 1, 0.5, 0.5, 250, ["#f00", "#f90", "#ff0"]);
		spawnParticlesAtPoint(this.posX - this.velocityX, this.posY - this.velocityY, 64, 0.5, 3, 0.1, 0.1, 500, ["#aaa", "#ccc", "#fff"]);
	}
}
