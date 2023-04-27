const canvasElem = document.getElementById("gamecanvas") as HTMLCanvasElement;
const canvasContext = canvasElem.getContext("2d")!;

let canvasScale = 0;

export function resetCanvasSize() {
	let windowWidth = window.innerWidth;
	let windowHeight = window.innerHeight;
	canvasScale = Math.min(windowWidth / 3, windowHeight / 2);
	canvasElem.width = canvasScale * 3;
	canvasElem.height = canvasScale * 2;
	canvasElem.style.marginLeft = ((windowWidth - canvasElem.width) / 2) + "px";
	canvasElem.style.marginTop = ((windowHeight - canvasElem.height) / 2) + "px";
	canvasContext.imageSmoothingEnabled = false; // must be re-set on every size change
}

addEventListener("resize", (event) => {resetCanvasSize()});
