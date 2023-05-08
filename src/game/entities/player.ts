import { PhysicsEntity } from "./physicsentity";
import { clientPlayerEntity, spawnEntity } from "../entitymanager";
import { keyState, keyPressed, mousePos } from "../inputtracker";
import { drawTextRelative } from "../render/renderingmanager";
import { spawnParticlesAtPoint } from "../render/particlespawner";
import { queueEvent } from "../tickingmanager";
import { PlayerUpdate } from "../events/playerupdate";
import { PlayerJump } from "../events/playerjump";
import { toggleNetGraph } from "../render/hud";
import { PlayerUse } from "../events/playeruse";
import { Rocket, rocketSpeed } from "./rocket";

let playerSpeedX = 0.1;

export class Player extends PhysicsEntity {

	id: string;
	lastUpdateEventTimestamp = 0;
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
			this.velocityX *= 0.8;
			super.tick();
			if (keyPressed["w"] || keyPressed[" "]) {
				if (this.canJump || Math.abs(this.canWallJumpOnSide) == 1) {
					this.jump();
				}
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
			if (keyPressed["l"]) {
				toggleNetGraph();
			}
			if (keyPressed["mouse0"]) {
				console.log("using item due to mouse")
				this.useItem(mousePos.x, mousePos.y);
			}
			queueEvent(new PlayerUpdate(this.posX, this.posY, this.velocityX, this.velocityY));
		}
	}

	draw(): void {
		super.draw();
		drawTextRelative(this.id, "black", this.posX, this.posY - 0.8);
	}

	jump() {
		this.velocityY = -0.4;
		this.canJump = false;
		this.canWallJumpOnSide = 0;
		spawnParticlesAtPoint(this.posX, this.posY + 0.5, 32, 0.1, 0.5, 0.1, 0.5, 200, ["#aaa", "#ccc", "#fff"]);
		if (this == clientPlayerEntity) {
			queueEvent(new PlayerJump());
		}
	}

	useItem(withMouseX: number, withMouseY: number) {
		let mouseBearing = Math.atan2(withMouseY - this.posY, withMouseX - this.posX);
		spawnEntity(new Rocket(this.posX, this.posY, Math.cos(mouseBearing) * rocketSpeed, Math.sin(mouseBearing) * rocketSpeed));
		if (this == clientPlayerEntity) {
			console.log("sending PlayerUse event");
			queueEvent(new PlayerUse(withMouseX, withMouseY));
		}
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
