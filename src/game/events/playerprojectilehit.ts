import { Event } from "./event";
import { Player } from "../entities/player";
import { Projectile } from "../entities/projectile";
import { entityList } from "../entitymanager";

export class PlayerProjectileHit extends Event {

	byPlayer: string;

	constructor (byPlayer: string) {
		super("PlayerProjectileHit");
		this.byPlayer = byPlayer;
	}

	static doEvent(json: any): void {
		entityList.forEach(player => {
			if (player instanceof Player) {
				if (player.id == json.peerId) {
					player.projectileHitSearch(json.byPlayer);
				}
			}
		});
	}
}
