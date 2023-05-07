export let keyState: { [key: string]: boolean } = {};
export let keyPressed: { [key: string]: boolean } = {};

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
