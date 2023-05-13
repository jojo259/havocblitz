import { PhysicsEntity } from "./physicsentity";
import { spawnParticlesAtPoint } from "../render/particlespawner";
import { drawImageRelativeCircularRotated } from "../render/renderingmanager";
import { entityList } from "../entitymanager";
import { getDist, getBearing } from "../util";
import { Player } from "./player";

export let rocketSpeed = 0.5;
let rocketExplosionMaxDist = 3;
let rocketExplosionEnergy = 0.4;

export class Rocket extends PhysicsEntity {

	constructor(posX: number, posY: number, velocityX: number, velocityY: number, color: number[]) {
		super(posX, posY, 0.8, "./game/sprites/entities/rocket.png", color);
		this.velocityX = velocityX;
		this.velocityY = velocityY;
	}

	tick() {
		super.tick();
	}

	draw() {
		let rocketBearing = Math.atan2(this.velocityY, this.velocityX);
		if (this.sprite) {
			drawImageRelativeCircularRotated(this.sprite, this.posX, this.posY, this.diameter, rocketBearing * (180 / Math.PI));
		}
		spawnParticlesAtPoint(this.posX - this.velocityX, this.posY - this.velocityY, 8, 0.1, 0.5, 0.1, 0.1, 100, ["#f00", "#f90", "#ff0"]);
	}

	collide(horizontal: boolean, vertical: boolean) {
		this.posX += this.velocityX; // for later bearing calculations in the edge case of blowing up at the exact coordinates of a player
		this.posY += this.velocityY;
		spawnParticlesAtPoint(this.posX - this.velocityX, this.posY - this.velocityY, 64, 0.1, 1, 0.5, 0.5, 250, ["#f00", "#f90", "#ff0"]);
		spawnParticlesAtPoint(this.posX - this.velocityX, this.posY - this.velocityY, 64, 0.5, 3, 0.1, 0.1, 500, ["#aaa", "#ccc", "#fff"]);
		entityList.forEach(entity => {
			if (entity instanceof Player) {
				let dist = getDist(this.posX, this.posY, entity.posX, entity.posY);
				if (dist < rocketExplosionMaxDist) {
					let bearing = getBearing(this.posX, this.posY, entity.posX, entity.posY);
					entity.velocityX = Math.cos(bearing) * rocketExplosionEnergy;
					entity.velocityY = Math.sin(bearing) * rocketExplosionEnergy;
					entity.freeFalling = true;
				}
			}
		});
		this.destroy();
	}
}
