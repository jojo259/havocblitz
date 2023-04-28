import { resetCanvasSize } from "./page/canvas"
import { findRandomPeer } from "./net/peerfinder"

resetCanvasSize();

setInterval(findRandomPeer, 5000)
