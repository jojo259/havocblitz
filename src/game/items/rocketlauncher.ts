import { ProjectileShooter } from "./projectileshooter";
import { Player } from "../entities/player";
import { Rocket, rocketSpeed } from "../entities/rocket";
import { spawnEntity } from "../entitymanager";

export class RocketLauncher extends ProjectileShooter {
	constructor() {
		super("./game/sprites/items/rocketlauncher.png", rocketSpeed, (posX, posY, velocityX, velocityY) => new Rocket(posX, posY, velocityX, velocityY));
	}
}
