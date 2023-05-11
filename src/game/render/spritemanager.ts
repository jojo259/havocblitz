import { canvasScale } from "../../page/canvas";

type SpriteColors = {
	[key: string]: HTMLImageElement;
}

type SpriteCacher = {
	[key: string]: SpriteColors;
}

let spriteCacher: SpriteCacher = {}

export function clearCache() {
	spriteCacher = {};
}

export function getSprite(path: string, color: number[]): Promise<null | HTMLImageElement> {
	return spriteCached(path, color).then((cached) => {
		if (cached) {
			console.log("found cached sprite for: " + path);
			return cached;
		}
		return colorImage(path, color).then((sprite) => {
			if (sprite) {
				cacheSprite(path, color, sprite);
				console.log("loaded sprite for: " + path);
				return sprite;
			}
			else {
				console.error("coloring returned null");
				return null;
			}
		});
	});
}

function cacheSprite(path: string, color: number[], sprite: HTMLImageElement) {
	if (!spriteCacher.hasOwnProperty(path)) {
		spriteCacher[path] = {};
	}
	spriteCacher[path][color.toString()] = sprite;
}

function spriteCached(path: string, color: number[]): Promise<null | HTMLImageElement> {
	if (spriteCacher.hasOwnProperty(path)) {
		if (spriteCacher[path].hasOwnProperty(color.toString())) {
			return Promise.resolve(spriteCacher[path][color.toString()]);
		}
	}
	return Promise.resolve(null);
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.src = src;
		return img;
	});
}

function colorImage(src: string, color: number[]): Promise<null | HTMLImageElement> {
	return loadImage(src).then((sprite) => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d")!;

		let maximumDimensionPixels = canvasScale;

		let loadScale = maximumDimensionPixels / Math.min(sprite.width, sprite.height);
		
		canvas.width = sprite.width * loadScale;
		canvas.height = sprite.height * loadScale;

		ctx.drawImage(sprite, 0, 0, sprite.width * loadScale, sprite.height * loadScale);

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		const rgba2DArray: number[][][] = [];

		let index = 0;
		for (let y = 0; y < canvas.height; y++) {
			rgba2DArray[y] = [];
			for (let x = 0; x < canvas.width; x++) {
				rgba2DArray[y][x] = [
					imageData.data[index    ] * (color[0] + 1),
					imageData.data[index + 1] * (color[1] + 1),
					imageData.data[index + 2] * (color[2] + 1),
					imageData.data[index + 3]
				];
				index += 4;
			}
		}

		const newCanvas = document.createElement("canvas");
		const newCtx = newCanvas.getContext("2d")!;

		newCanvas.width = canvas.width;
		newCanvas.height = canvas.height;

		for (let y = 0; y < newCanvas.height; y++) {
			for (let x = 0; x < newCanvas.width; x++) {
				const index = (y * newCanvas.width + x) * 4;
				const newColor = rgba2DArray[y][x];
				imageData.data[index]     = newColor[0];
				imageData.data[index + 1] = newColor[1];
				imageData.data[index + 2] = newColor[2];
				imageData.data[index + 3] = newColor[3];
			}
		}

		newCtx.putImageData(imageData, 0, 0);

		return new Promise((resolve) => {
			const editedImage = new Image();
			editedImage.onload = () => resolve(editedImage);
			editedImage.src = newCanvas.toDataURL("image/png");
			return editedImage;
		});
	});
}
