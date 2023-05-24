import { Projectile } from "./projectile";
import { spawnParticlesAtPoint } from "../render/particlespawner";
import { drawImageRelativeCircularRotated } from "../render/renderingfuncs";
import { entityList } from "../entitymanager";
import { getDist, getBearing } from "../util";
import { Player } from "./player";

export let arrowSpeed = 0.8;

export class Arrow extends Projectile {

	constructor(posX: number, posY: number, velocityX: number, velocityY: number) {
		super(posX, posY, 0.1, 3, velocityX, velocityY, "./game/sprites/entities/arrow.png", [0, 0, 0]);
	}

	tick() {
		super.tick();
	}

	draw() {
		super.draw();
		spawnParticlesAtPoint(this.posX - this.velocityX, this.posY - this.velocityY, 8, 0.1, 0.3, 0.1, 0.1, 100, ["#fff", "#eee", "#ddd"]);
	}

	collide(horizontal: boolean, vertical: boolean) {
		this.destroy();
	}
}
