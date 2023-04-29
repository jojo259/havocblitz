import { resetCanvasSize } from "./page/canvas"
import { findRandomPeer } from "./net/peerfinder"
import { sendData } from "./net/peermanager";

resetCanvasSize();

setInterval(findRandomPeer, 5000)
setInterval(() => {sendData("hello")}, 5000)
