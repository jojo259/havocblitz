import { canvasElem, canvasScale, renderScaleX, renderScaleY } from "../page/canvas";
import { clientPlayerEntity } from "./entitymanager";

export let keyState: { [key: string]: boolean } = {};
export let keyPressed: { [key: string]: boolean } = {};
export let mousePos: { [key: string]: number } = {x: 0, y: 0};

let mouseButtonNumbers = [0, 1, 2, 3, 4];

export function resetKeyPressed() {
	for (const key in keyPressed) {
		keyPressed[key] = false;
	}
}

export function initInputTracking() {
	window.addEventListener("keydown", (event) => {
		keyDown(event.key);
	});

	window.addEventListener("keyup", (event) => {
		keyUp(event.key);
	});

	window.addEventListener("mousedown", (event) => {
		keyDown("mouse" + event.button);
		processMouseEvent(event);
	});

	window.addEventListener("mouseup", (event) => {
		keyUp("mouse" + event.button);
		processMouseEvent(event);
	});

	window.addEventListener("mousemove", (event) => {
		processMouseEvent(event);
	});

	window.addEventListener('contextmenu', (event) => {
		event.preventDefault();
	});
}

function processMouseEvent(event: MouseEvent) {
	let canvasRect = canvasElem.getBoundingClientRect();
	let mousePosRelativeX = (event.clientX - canvasRect.left) / canvasScale + clientPlayerEntity.posX - renderScaleX / 2;
	let mousePosRelativeY = (event.clientY - canvasRect.top) / canvasScale + clientPlayerEntity.posY - renderScaleY / 2;
	mousePos = {x: mousePosRelativeX, y: mousePosRelativeY};
	if (mouseButtonNumbers.includes(event.button)) {
		event.preventDefault();
	}
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
