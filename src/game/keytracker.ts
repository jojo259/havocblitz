export let keyState: { [key: string]: boolean } = {};

export function addListeners() {
	window.addEventListener("keydown", (event) => {
		console.log("key down: " + event.key);
		keyState[event.key] = true;
	});

	window.addEventListener("keyup", (event) => {
		console.log("key up: " + event.key);
		keyState[event.key] = false;
	});
}
