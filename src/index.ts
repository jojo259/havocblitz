import { addClientPlayerEntity, reloadSprites } from "./game/entitymanager";
import { queueResetCanvasResize } from "./page/canvas";
import { findRandomPeer } from "./net/peerfinder";
import { sendData } from "./net/peermanager";
import { considerTicking, considerTickingIntervalMs } from "./game/tickingmanager";
import { initInputTracking } from "./game/inputtracker";
import { initClientPeer } from "./net/peermanager";
import { genMap } from "./game/mapmanager";

genMap();
addClientPlayerEntity();
initClientPeer();

queueResetCanvasResize();

setInterval(findRandomPeer, 1000);

setInterval(considerTicking, considerTickingIntervalMs);

initInputTracking();
setTimeout(reloadSprites, 100);
