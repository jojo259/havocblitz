import { resetCanvasSize } from "./page/canvas";
import { findRandomPeer } from "./net/peerfinder";
import { sendData } from "./net/peermanager";
import { addClientPlayerEntity } from "./game/entitymanager";
import { considerTicking, considerTickingIntervalMs } from "./game/tickingmanager";
import { addListeners } from "./game/inputtracker";

resetCanvasSize();

//setInterval(findRandomPeer, 1000);

setInterval(considerTicking, considerTickingIntervalMs);

addClientPlayerEntity();
addListeners();
