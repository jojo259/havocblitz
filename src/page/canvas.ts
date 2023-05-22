export const canvasElem = document.getElementById("gamecanvas") as HTMLCanvasElement;
export const canvasContext = canvasElem.getContext("2d")!;

export let canvasScale = 0;

export let renderScaleX = 30 / 4;
export let renderScaleY = 20 / 4;

export function resetCanvasSize() {
	let windowWidth = window.innerWidth;
	let windowHeight = window.innerHeight;
	canvasScale = Math.min(windowWidth / renderScaleX, windowHeight / renderScaleY);
	canvasElem.width = canvasScale * renderScaleX;
	canvasElem.height = canvasScale * renderScaleY;
	canvasElem.style.marginLeft = ((windowWidth - canvasElem.width) / 2) + "px";
	canvasElem.style.marginTop = ((windowHeight - canvasElem.height) / 2) + "px";
	canvasContext.imageSmoothingEnabled = false; // must be re-set on every size change
}

addEventListener("resize", (event) => {resetCanvasSize()});
