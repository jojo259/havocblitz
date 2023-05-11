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
import { CountryCode } from "../events/countrycode";

let playerSpeedX = 0.1;
let playerMaximumVelocityX = 0.25;

export class Player extends PhysicsEntity {

	id: string;
	lastUpdateEventTimestamp = 0;
	team: string = "null";
	freeFalling = false;
	countryCode: string = "null";
	flagEmoji: string = "";

	constructor(
		id: string,
		posX: number, 
		posY: number,
	) {
		super(posX, posY, 0.95, "./game/sprites/player.png");
		this.id = id;
		this.setTeam();
	}

	tick(): void {
		if (this == clientPlayerEntity) {
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
			if (keyState["w"] || keyState["a"] || keyState["s"] || keyState["d"]) {
				this.freeFalling = false;
			}
			if (!this.freeFalling) {
				this.limitVelocityX();
			}
			if (keyPressed["l"]) {
				toggleNetGraph();
			}
			if (keyPressed["mouse0"]) {
				console.log("using item due to mouse")
				this.useItem(mousePos.x, mousePos.y);
			}
			queueEvent(new PlayerUpdate(this.posX, this.posY, this.velocityX, this.velocityY));
			if (this.countryCode == "null" && Math.random() <= 0.01) {
				this.checkCountryCode();
			}
			if (Math.random() <= 0.01) {
				queueEvent(new CountryCode(this.countryCode));
			}
		}
	}

	limitVelocityX() {
		this.velocityX *= 0.8;
		if (Math.abs(this.velocityX) > playerMaximumVelocityX) {
			this.velocityX = Math.sign(this.velocityX) * Math.max(playerMaximumVelocityX, this.velocityX - playerSpeedX);
		}
	}

	collide(collX: number, collY: number, sideX: number, sideY: number) {
		super.collide(collX, collY, sideX, sideY);
		this.freeFalling = false;
	}

	draw(): void {
		super.draw();
		drawTextRelative(this.id, "black", this.posX, this.posY - 0.8);
		drawTextRelative(this.flagEmoji, "black", this.posX, this.posY - 1.2);
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

	outOfBounds() {
		this.velocityX = 0;
		this.velocityY = 0;
		this.findSpawn();
	}

	checkCountryCode() {
		fetch("https://api.bigdatacloud.net/data/reverse-geocode-client", {mode: "cors"})
			.then(response => response.json())
			.then(data => {
				this.setCountryCodeAndFlag(data.countryCode);
				console.log("checked country code: " + this.countryCode);
			}
		);
	}

	setCountryCodeAndFlag(code: string) {
		if (this.countryCode != code) {
			this.countryCode = code;
			this.flagEmoji = getFlagEmoji(this.countryCode);
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

function getFlagEmoji(countryCode: string) {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map(char =>  127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
}
