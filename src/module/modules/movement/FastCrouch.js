import Module from "../../module";
import hooks from "../../../hooks";

export default class FastCrouch extends Module {
    constructor () {
        super("Fast Crouch", "Makes you crouch as fast as you run.", "Movement", null, "")
    }

    onEnable () {
        if (!gameUtils.inGame) return;
        hooks.noa.serverSettings.crouchingSpeed = 7.75;
    }

    onDisable () {
        if (!gameUtils.inGame) return;
        hooks.noa.serverSettings.crouchingSpeed = 2;
    }

    onEnterWorld () {
        this.onEnable();
    }
};