import { PhysicsEntity } from "./physicsentity";
import { keyState, keyPressed, mousePos } from "../inputtracker";
import { drawTextRelative, drawImageRelativeCircularRotated, drawLineRelative } from "../render/renderingfuncs";
import { spawnParticlesAtPoint } from "../render/particlespawner";
import { queueEvent } from "../tickingmanager";
import { PlayerUpdate } from "../events/playerupdate";
import { PlayerJump } from "../events/playerjump";
import { toggleDebugVisuals } from "../render/renderer";
import { PlayerUse } from "../events/playeruse";
import { CountryCode } from "../events/countrycode";
import { MapSend } from "../events/mapsend";
import { getBearing } from "../util";
import { Item } from "../items/item";
import { RocketLauncher } from "../items/rocketlauncher";
import { BowAndArrow } from "../items/bowandarrow";
import { PlayerHeldItemSlot } from "../events/playerhelditemslot";

const playerMaxHealth = 100;

interface PlayerItems extends Array<Item> {
	[index: number]: Item;
}

export let playerItems: PlayerItems = [
	new RocketLauncher(),
	new BowAndArrow(),
]

let playerSpeedX = 0.1;
let playerMaximumVelocityX = 0.25;

let playerColors = [
	[1, 0, 0],
	[0, 1, 0],
	[0, 0, 1],
	[1, 1, 0],
	[0, 1, 1],
	[1, 0, 1],
]

export class Player extends PhysicsEntity {

	id: string;
	heldItemSlot: number;
	lastUpdateEventTimestamp = 0;
	team: string = "null";
	freeFalling = false;
	countryCode: string = "null";
	flagEmoji: string = "";
	mousePos: { [key: string]: number } = {x: 0, y: 0};
	isClient = false;
	canJump = false;
	canWallJumpOnSide = 0; // 0 = cannot, 1 = right side, -1 = left side
	health = playerMaxHealth;

	constructor(
		id: string,
		posX: number, 
		posY: number,
		isClient: boolean,
	) {
		if (!id) {
			console.error("player id is falsey?!")
		}
		super(posX, posY, 0.95, "./game/sprites/entities/player.png", getColor(id));
		this.id = id;
		this.heldItemSlot = 0;
		this.isClient = isClient;
	}

	tick(): void {
		if (this.isClient) {
			super.tick();
			if (Math.random() <= 0.1) {
				this.changeHealth(1);
			}
			this.mousePos = mousePos;
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
				toggleDebugVisuals();
			}
			if (keyPressed["mouse0"]) {
				console.log("using item due to mouse")
				this.useItem(mousePos.x, mousePos.y);
			}
			if (keyPressed["scrollDown"] || keyPressed["q"]) {
				this.setHeldItemSlot(this.heldItemSlot - 1);
			}
			if (keyPressed["scrollUp"] || keyPressed["e"]) {
				this.setHeldItemSlot(this.heldItemSlot + 1);
			}
			queueEvent(new PlayerUpdate(this.posX, this.posY, this.velocityX, this.velocityY, mousePos));
			if (this.countryCode == "null" && Math.random() <= 0.01) {
				this.checkCountryCode();
			}
			if (Math.random() <= 0.01) {
				queueEvent(new CountryCode(this.countryCode));
			}
			if (Math.random() <= 0.001) {
				queueEvent(new MapSend());
			}
		}
	}

	changeHealth(by: number) {
		this.health += by;
		if (this.health <= 0) {
			this.die();
		}
		this.health = Math.min(this.health, playerMaxHealth);
	}

	die() {
		this.health = playerMaxHealth;
		this.velocityX = 0;
		this.velocityY = 0;
		this.findSpawn();
	}

	collide (collX: number, collY: number, bearingDeg: number) {
		this.freeFalling = false;

		if (Math.abs(bearingDeg) <= 45) {
			this.canJump = true;
		}

		if (Math.abs(bearingDeg) <= 1) {
			this.velocityY = 0;
		}

		if (Math.abs(this.velocityX) > 0.1 && Math.abs(bearingDeg) >= 80 && Math.abs(bearingDeg) <= 100) {
			this.canWallJumpOnSide = Math.sign(bearingDeg);
			this.velocityX = 0;
		}
	}

	limitVelocityX() {
		this.velocityX *= 0.8;
		if (Math.abs(this.velocityX) > playerMaximumVelocityX) {
			this.velocityX = Math.sign(this.velocityX) * Math.max(playerMaximumVelocityX, this.velocityX - playerSpeedX);
		}
	}

	draw(): void {
		super.draw();
		drawImageRelativeCircularRotated(playerItems[this.heldItemSlot].sprite, this.posX + 0.2, this.posY + 0.2, 0.8, getBearing(this.posX, this.posY, this.mousePos.x, this.mousePos.y) * (180 / Math.PI));
		drawTextRelative(this.flagEmoji, "black", 0.4, this.posX, this.posY - 1.4);
		drawTextRelative(this.id, "black", 0.4, this.posX, this.posY - 1);
		drawLineRelative(this.posX - 1, this.posY - 0.8, this.posX + 1, this.posY - 0.8, 0.15, "#f00");
		drawLineRelative(this.posX - 1, this.posY - 0.8, this.posX - 1 + this.health / playerMaxHealth * 2, this.posY - 0.8, 0.15, "#0f0");
	}

	jump() {
		this.velocityY = -0.4;
		this.canJump = false;
		this.canWallJumpOnSide = 0;
		spawnParticlesAtPoint(this.posX, this.posY + 0.5, 32, 0.1, 0.5, 0.1, 0.5, 200, ["#aaa", "#ccc", "#fff"]);
		if (this.isClient) {
			queueEvent(new PlayerJump());
		}
	}

	useItem(withMouseX: number, withMouseY: number) {
		playerItems[this.heldItemSlot].use(this, {x: withMouseX, y: withMouseY});
		if (this.isClient) {
			console.log("sending PlayerUse event");
			queueEvent(new PlayerUse(withMouseX, withMouseY));
		}
	}

	setHeldItemSlot(toNum: number) {
		if (toNum < 0) {
			toNum = playerItems.length - 1;
		}
		if (toNum > playerItems.length - 1) {
			toNum = 0;
		}
		this.heldItemSlot = toNum;
		if (this.isClient) {
			queueEvent(new PlayerHeldItemSlot(this.heldItemSlot));
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
}

function getColor(id: string) {
	let pureID = +id.replace(/\D/g, "");
	let color = playerColors[pureID % playerColors.length];
	return color;
}

function getFlagEmoji(countryCode: string) {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map(char =>  127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
}
