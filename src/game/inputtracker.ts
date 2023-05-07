import { canvasElem, canvasScale, renderScaleX, renderScaleY } from "../page/canvas";
import { clientPlayerEntity } from "./entitymanager";

export let keyState: { [key: string]: boolean } = {};
export let keyPressed: { [key: string]: boolean } = {};
export let mousePos: { [key: string]: number } = {x: 0, y: 0};

export function resetKeyPressed() {
	for (const key in keyPressed) {
		keyPressed[key] = false;
	}
}

export function addListeners() {
	window.addEventListener("keydown", (event) => {
		keyDown(event.key);
	});

	window.addEventListener("keyup", (event) => {
		keyUp(event.key);
	});

	window.addEventListener("mousedown", function(event) {
		keyDown("mouse" + event.button);
	});

	window.addEventListener("mouseup", function(event) {
		keyUp("mouse" + event.button);
	});

	window.addEventListener("mousemove", function(event) {
		let canvasRect = canvasElem.getBoundingClientRect();
		let mousePosRelativeX = (event.clientX - canvasRect.left) / canvasScale + clientPlayerEntity.posX - renderScaleX / 2;
		let mousePosRelativeY = (event.clientY - canvasRect.top) / canvasScale + clientPlayerEntity.posY - renderScaleY / 2;
		mousePos = {x: mousePosRelativeX, y: mousePosRelativeY}
	});
}

function keyDown(key: string) {
	console.log("key down: " + key);
	if (!keyState[key]) {
		keyPressed[key] = true;
		console.log("key pressed: " + key);
	}
	keyState[key] = true;
}

function keyUp(key: string) {
	console.log("key up: " + key);
	keyState[key] = false;
}
