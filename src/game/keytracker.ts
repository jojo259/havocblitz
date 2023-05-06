export let keyState: { [key: string]: boolean } = {};
export let keyPresses: { [key: string]: boolean } = {};

export function resetKeyPresses() {
	for (const key in keyPresses) {
		keyPresses[key] = false;
	}
}

export function addListeners() {
	window.addEventListener("keydown", (event) => {
		console.log("key down: " + event.key);
		if (!keyState[event.key]) {
			keyPresses[event.key] = true;
			console.log("key pressed: " + event.key);
		}
		keyState[event.key] = true;
	});

	window.addEventListener("keyup", (event) => {
		console.log("key up: " + event.key);
		keyState[event.key] = false;
	});
}
