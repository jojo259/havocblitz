import { resetCanvasSize } from "./page/canvas"
import { findRandomPeer } from "./net/peerfinder"
import { sendData } from "./net/peermanager";
import { addClientPlayerEntity } from "./game/entitymanager";
import { doGameTick } from "./game/tickingmanager"
import { drawGame } from "./game/render/renderingmanager";
import { addListeners } from "./game/inputtracker";

resetCanvasSize();

setInterval(findRandomPeer, 1000)

setInterval(doGameTick, 1000 / 64);
setInterval(drawGame, 1000 / 64);

addClientPlayerEntity();
addListeners();
