import { PhysicsEntity } from "./physicsentity";
import { clientPlayerEntity } from "../entitymanager";
import { keyState, keyPresses } from "../keytracker";
import { drawTextRelative } from "../render/renderingmanager";

let playerSpeedX = 0.1;

export class Player extends PhysicsEntity {

	id: string;
	lastPositionEventTimestamp = 0;
	team: string = "null";

	constructor(
		id: string,
		posX: number, 
		posY: number,
	) {
		super(posX, posY, 0.2, 1, 0.95, "./game/sprites/player.png");
		this.id = id;
		this.setTeam();
	}

	tick(): void {
		if (this == clientPlayerEntity) {
			super.tick();
			if (keyPresses["w"] && (this.canJump || Math.abs(this.canWallJumpOnSide) == 1)) {
				this.velocityY = -0.4;
				this.canJump = false;
				this.canWallJumpOnSide = 0;
			}
			if (keyState["s"]) {
				this.velocityY += 0.1;
			}
			if (keyState["a"]) {
				this.velocityX -= playerSpeedX;
			}
			if (keyState["d"]) {
				this.velocityX += playerSpeedX;
			}
		}
	}

	draw(): void {
		super.draw();
		drawTextRelative(this.id, "black", this.posX, this.posY - 0.8);
	}

	setTeam() {
		let team="", newSpriteSrc="";
		let pureID = +this.id.replace(/\D/g, "");
		if (pureID % 2 == 0){
			team = "red";
			newSpriteSrc = "./game/sprites/playerred.png";
		}
		else if (pureID % 2 == 1){
			team = "blue";
			newSpriteSrc = "./game/sprites/playerblue.png";
		}
		else{
			team = "NaN";
			newSpriteSrc = "./game/sprites/player.png";
		}
		console.log("set player team to " + team);
		this.sprite.src = newSpriteSrc;
		this.team = team;
	}
}
