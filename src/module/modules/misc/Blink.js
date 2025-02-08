import Module from "../../module";
import hooks from "../../../hooks";

let packets = [];

export default class Blink extends Module {
    constructor() {
        super("Blink", "Stops sending packets, then sends them all at once.", "Misc", {
            "Interval": 0,
            "No Packet": false
        });
        this.packets = [];
    }

    get colyRoom() {
        return hooks.noa.bloxd.client.msgHandler.colyRoom;
    }

    onEnable() {
        this.sendBytes = this.sendBytes || this.colyRoom.sendBytes;
        const sendBytes = this.sendBytes;
        const options = this.options;

        this.colyRoom.sendBytes = (...args) => {
            const context = this.colyRoom;
            const interval = parseFloat(options["Interval"]);

            if (options["No Packet"]) return;

            if (interval !== 0) {
                setTimeout(() => {
                    sendBytes.apply(context, args);
                }, interval);
            } else {
                packets.push(args);
            }
        };
    }

    onDisable() {
        packets.forEach(packet => {
            this.sendBytes.apply(this.colyRoom, packet);
        });
        
        this.colyRoom.sendBytes = this.sendBytes;
        packets = [];
    }
}