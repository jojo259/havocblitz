import { Projectile } from "./projectile";
import { spawnParticlesAtPoint } from "../render/particlespawner";
import { drawImageRelativeCircularRotated } from "../render/renderingfuncs";
import { entityList } from "../entitymanager";
import { getDist, getBearing } from "../util";
import { Player } from "./player";

export let arrowSpeed = 0.8;

export class Arrow extends Projectile {

	constructor(posX: number, posY: number, velocityX: number, velocityY: number, owner: Player) {
		super(posX, posY, 0.4, 3, velocityX, velocityY, "./game/sprites/entities/arrow.png", [0, 0, 0], owner);
	}

	tick() {
		super.tick();
	}

	draw() {
		super.draw();
		spawnParticlesAtPoint(this.posX - this.velocityX, this.posY - this.velocityY, 8, 0.1, 0.3, 0.1, 0.1, 100, ["#fff", "#eee", "#ddd"]);
	}

	surfaceCollide(collX: number, collY: number, bearingDeg: number) {
		this.destroy();
	}

	playerCollide(player: Player) {
		if (player.isClient) {
			player.changeHealth(-5);
		}
		player.bleed();
		this.destroy();
	}
}
