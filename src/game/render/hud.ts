import { entityList, clientPlayerEntity } from "../entitymanager";
import { Player } from "../entities/player";
import { canvasElem, canvasContext } from "../../page/canvas";

const playerMarkerLineStartOffset = canvasElem.width / 32;
const playerMarkerLineLength = canvasElem.width / 32;

export function renderHUD() {
	renderPlayerMarkers();
}

function renderPlayerMarkers() {
	entityList.forEach(function(entity) {
		if (entity instanceof Player) {
			if (entity.id != clientPlayerEntity.id) {
				const direction = {
					x: entity.posX - clientPlayerEntity.posX,
					y: entity.posY - clientPlayerEntity.posY
				};

				const lineStart = {
					x: canvasElem.width / 2 + direction.x * playerMarkerLineStartOffset,
					y: canvasElem.height / 2 + direction.y * playerMarkerLineStartOffset
				};
				const lineEnd = {
					x: canvasElem.width / 2 + direction.x * (playerMarkerLineStartOffset + playerMarkerLineLength),
					y: canvasElem.height / 2 + direction.y * (playerMarkerLineStartOffset + playerMarkerLineLength)
				};

				canvasContext.beginPath();
				canvasContext.moveTo(lineStart.x, lineStart.y);
				canvasContext.lineTo(lineEnd.x, lineEnd.y);
				canvasContext.strokeStyle = "white";
				canvasContext.lineWidth = 4;
				canvasContext.stroke();
			}
		}
	});
}
