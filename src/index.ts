import { queueResetCanvasResize } from "./page/canvas";
import { findRandomPeer } from "./net/peerfinder";
import { sendData } from "./net/peermanager";
import { addClientPlayerEntity, reloadSprites } from "./game/entitymanager";
import { considerTicking, considerTickingIntervalMs } from "./game/tickingmanager";
import { addListeners } from "./game/inputtracker";

queueResetCanvasResize();

setInterval(findRandomPeer, 1000);

setInterval(considerTicking, considerTickingIntervalMs);

addClientPlayerEntity();
addListeners();
setTimeout(reloadSprites, 100);
