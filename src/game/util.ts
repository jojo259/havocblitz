export function getDist(x1: number, y1: number, x2: number, y2: number): number {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function getBearing(x1: number, y1: number, x2: number, y2: number): number {
	return Math.atan2(y2 - y1, x2 - x1);
}

export function getIntersection(
	x1: number, y1: number, bearing1: number,
	x2: number, y2: number, bearing2: number
): number[] | null {
	const radians = (degrees: number): number => degrees * (Math.PI / 180);
	const deltaX1 = Math.cos(radians(bearing1));
	const deltaY1 = Math.sin(radians(bearing1));

	const deltaX2 = Math.cos(radians(bearing2));
	const deltaY2 = Math.sin(radians(bearing2));

	const determinant = deltaX1 * deltaY2 - deltaY1 * deltaX2;

	if (determinant === 0) {
		return null;
	}

	const C1 = deltaY1 * x1 - deltaX1 * y1;
	const C2 = deltaY2 * x2 - deltaX2 * y2;

	const x = (deltaX1 * C2 - deltaX2 * C1) / determinant;
	const y = (deltaY1 * C2 - deltaY2 * C1) / determinant;

	return [x, y];
}
