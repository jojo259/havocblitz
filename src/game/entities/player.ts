import { PhysicsEntity } from "./physicsentity";
import { clientPlayerEntity } from "../entitymanager";
import { keyState } from "../keytracker";

export class Player extends PhysicsEntity {

	id: string;
	playerSpeedX = 0.05;
	lastPositionEventTimestamp = 0;

	constructor(id: string, posX: number, posY: number) {
		super(posX, posY, 0.2, 1, 1, "./game/sprites/player.png");
		this.id = id;
	}

	tick(): void {
		if (this == clientPlayerEntity) {
			super.tick();
			if (keyState["w"]) {
				this.velocityY = -0.3;
			}
			if (keyState["s"]) {
				this.velocityY += 0.1;
			}
			if (keyState["a"]) {
				this.velocityX -= this.playerSpeedX;
			}
			if (keyState["d"]) {
				this.velocityX += this.playerSpeedX;
			}
		}
	}
}
