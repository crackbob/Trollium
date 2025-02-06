import Module from "../../module";
import hooks from "../../../hooks";

let packets = [];
export default class Blink extends Module {
    constructor () {
        super("Blink", "Stops sending packets, then sends them all at once.", "Misc")
        this.packets = [];
    }

    get colyRoom () {
        return hooks.noa.bloxd.client.msgHandler.colyRoom;
    }

    onEnable () {
        if (!gameUtils.inGame) return;
        this.sendBytes = this.sendBytes || this.colyRoom.sendBytes;
        this.colyRoom.sendBytes = function () {
            packets.push(arguments);
        }
    }

    onDisable () {
        if (!gameUtils.inGame) return;
        packets.forEach(packet => this.sendBytes.apply(this.colyRoom, packet));
        this.colyRoom.sendBytes = this.sendBytes;
        packets = [];
    }
};