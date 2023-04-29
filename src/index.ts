import { resetCanvasSize } from "./page/canvas"
import { findRandomPeer } from "./net/peerfinder"
import { sendData } from "./net/peermanager";
import { addClientPlayerEntity } from "./game/entitymanager";
import { doGameTick } from "./game/tickingmanager"
import { drawGame } from "./game/renderer";
import { addListeners } from "./game/keytracker";

resetCanvasSize();

setInterval(findRandomPeer, 1000)

setInterval(doGameTick, 1000 / 64);
setInterval(drawGame, 1000 / 64);

addClientPlayerEntity();
addListeners();
