import { resetCanvasSize } from "./page/canvas"
import { findRandomPeer } from "./net/peerfinder"
import { sendData } from "./net/peermanager";
import { doTick, addClientPlayerEntity } from "./game/entitymanager";
import { drawGame } from "./game/renderer";
import { addListeners } from "./game/keytracker";

resetCanvasSize();

setInterval(findRandomPeer, 5000)
setInterval(() => {sendData("hello")}, 5000)

setInterval(doTick, 1000 / 64);
setInterval(drawGame, 1000 / 64);

addClientPlayerEntity();
addListeners();
