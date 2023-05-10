type SpriteColors = {
	[key: string]: HTMLImageElement;
}

type SpriteCacher = {
	[key: string]: SpriteColors;
}

let spriteCacher: SpriteCacher = {}

export function getSprite(path: string, color: number[]): Promise<null | HTMLImageElement> {
	console.time("checking cache");
	return spriteCached(path, color).then((cached) => {
		console.timeEnd("checking cache");
		if (cached) {
			console.log("sprite was cached");
			return cached;
		}
		console.time("coloring image");
		return colorImage(path, color).then((sprite) => {
			console.timeEnd("coloring image");
			if (sprite) {
				console.log("returning loaded sprite");
				cacheSprite(path, color, sprite);
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
	console.log("loading image");
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.src = src;
		console.log("returning loaded image");
		return img;
	});
}

function colorImage(src: string, color: number[]): Promise<null | HTMLImageElement> {
	return loadImage(src).then((sprite) => {
		console.log("doing coloring");

		console.time("total coloring");

		console.time("creating elements");

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d")!;

		console.timeEnd("creating elements");
		
		canvas.width = sprite.width;
		canvas.height = sprite.height;

		console.time("drawing to canvas");

		ctx.drawImage(sprite, 0, 0);

		console.timeEnd("drawing to canvas");

		console.time("getting image data");

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		console.timeEnd("getting image data");

		console.time("coloring image array");

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

		console.timeEnd("coloring image array");

		console.time("creating second canvas");

		const newCanvas = document.createElement("canvas");
		const newCtx = newCanvas.getContext("2d")!;

		newCanvas.width = canvas.width;
		newCanvas.height = canvas.height;

		console.timeEnd("creating second canvas");

		console.time("creating image data");

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

		console.timeEnd("creating image data");

		console.time("putting image data");

		newCtx.putImageData(imageData, 0, 0);

		console.timeEnd("putting image data");

		console.log("returning colored image promise");

		return new Promise((resolve) => {
			const editedImage = new Image();
			editedImage.onload = () => resolve(editedImage);
			editedImage.src = newCanvas.toDataURL("image/png");
			console.log("returning colored image within promise");
			console.timeEnd("total coloring");
			return editedImage;
		});
	});
}
