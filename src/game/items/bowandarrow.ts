import { ProjectileShooter } from "./projectileshooter";
import { Player } from "../entities/player";
import { Arrow, arrowSpeed } from "../entities/arrow";
import { spawnEntity } from "../entitymanager";

export class BowAndArrow extends ProjectileShooter {
	constructor() {
		super("./game/sprites/items/bowandarrow.png", arrowSpeed, (posX, posY, velocityX, velocityY) => new Arrow(posX, posY, velocityX, velocityY));
	}
}
