import { Item } from "./item";
import { Player } from "../entities/player";
import { Rocket, rocketSpeed } from "../entities/rocket";
import { spawnEntity } from "../entitymanager";

export class RocketLauncher extends Item {
	constructor() {
		super("./game/sprites/items/rocketlauncher.png");
	}

	use(player: Player, mousePos: {[key: string]: number}) {
		let mouseBearing = Math.atan2(mousePos.y - player.posY, mousePos.x - player.posX);
		spawnEntity(new Rocket(player.posX, player.posY, Math.cos(mouseBearing) * rocketSpeed, Math.sin(mouseBearing) * rocketSpeed, [0.5, 0, 0]));
	}
}
