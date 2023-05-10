import { resetCanvasSize } from "./page/canvas"
import { findRandomPeer } from "./net/peerfinder"
import { sendData } from "./net/peermanager";
import { addClientPlayerEntity } from "./game/entitymanager";
import { considerTicking } from "./game/tickingmanager"
import { addListeners } from "./game/inputtracker";

resetCanvasSize();

setInterval(findRandomPeer, 1000)

setInterval(considerTicking, 1);

addClientPlayerEntity();
addListeners();
