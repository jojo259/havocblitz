import { Particle } from "../entities/particle";
import { entityList } from "../entitymanager";

export function spawnParticlesAtPoint(x: number, y: number, count: number, minDiameter: number, maxDiameter: number, maxVelocityX: number, maxVelocityY: number, maxAliveTime: number, colors: string[]) {
	for (let i = 0; i < count; i++) {
		spawnParticle(new Particle(x, y, minDiameter + Math.random() * (maxDiameter - minDiameter), (Math.random() * 2 - 1) * maxVelocityX, (Math.random() * 2 - 1) * maxVelocityX, Math.random() * maxAliveTime, getRandomColor(colors)));
	}
}

function spawnParticle(particle: Particle) {
	entityList.push(particle);
}

function getRandomColor(array: string[]): string {
	return array[Math.floor(Math.random() * array.length)];
}
