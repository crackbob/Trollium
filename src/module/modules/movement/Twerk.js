import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

export default class Twerk extends Module {
    constructor() {
        super("Twerk", "miley cyrus", "Movement", {
            "Interval": 500
        });

        this.shouldCrouch = true;
        this.lastToggleTime = 0;
    }

    onEnable() {
        this.shouldCrouch = true;
        this.lastToggleTime = Date.now();
        hooks.noa.inputs.state.__defineGetter__("crouch", () => this.shouldCrouch);
        hooks.noa.inputs.state.__defineSetter__("crouch", () => this.shouldCrouch);
    }

    onGameTick() {
        const currentTime = Date.now();
        const interval = parseFloat(this.options["Interval"]);

        if (interval > 0) {
            if (currentTime - this.lastToggleTime >= interval) {
                this.shouldCrouch = !this.shouldCrouch;
                this.lastToggleTime = currentTime;
            }
        }
    }

    onDisable() {
        delete hooks.noa.inputs.state.crouch;
        hooks.noa.inputs.state.crouch = false;
        this.shouldCrouch = false;
    }
}