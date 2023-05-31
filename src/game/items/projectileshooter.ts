import { Item } from "./item";
import { Player } from "../entities/player";
import { Projectile } from "../entities/projectile";
import { Rocket, rocketSpeed } from "../entities/rocket";
import { spawnEntity } from "../entitymanager";

export class ProjectileShooter extends Item {

	shootProjectile: (posX: number, posY: number, velocityX: number, velocityY: number, player: Player) => Projectile;
	shootSpeed: number;

	constructor(spriteSrc: string, shootSpeed: number, shootProjectile: (posX: number, posY: number, velocityX: number, velocityY: number, player: Player) => Projectile) {
		super(spriteSrc);
		this.shootProjectile = shootProjectile;
		this.shootSpeed = shootSpeed;
	}

	use(player: Player, mousePos: {[key: string]: number}) {
		let mouseBearing = Math.atan2(mousePos.y - player.posY, mousePos.x - player.posX);
		let projectile = this.shootProjectile(player.posX, player.posY, Math.cos(mouseBearing) * this.shootSpeed, Math.sin(mouseBearing) * this.shootSpeed, player);
		spawnEntity(projectile);
	}
}
