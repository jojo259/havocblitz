import { PhysicsEntity } from "./physicsentity";
import { clientPlayerEntity } from "../entitymanager";
import { keyState } from "../keytracker";
import { drawTextRelative } from "../renderer";

export class Player extends PhysicsEntity {

	id: string;
	team: string;
	playerSpeedX = 0.1;
	lastPositionEventTimestamp = 0;

	constructor(
		id: string,
		team: string,
		spriteSrc: string,
		posX: number, 
		posY: number,
		) {
		super(posX, posY, 0.2, 1, 1, spriteSrc);
		this.id = id;
		this.team = team;
	}

	tick(): void {
		if (this == clientPlayerEntity) {
			super.tick();
			if (keyState["w"] && this.canJump) {
				this.velocityY = -0.4;
				this.canJump = false;
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

	draw(): void {
		super.draw();
		drawTextRelative(this.id, "black", this.posX, this.posY - 0.8);
	}
}
