import Module from "../../module";
import hooks from "../../../hooks";

export default class FastCrouch extends Module {
    constructor () {
        super("Fast Crouch", "Makes you crouch as fast as you run.", "Movement", null, "")
    }

    onEnable () {
        
        hooks.noa.serverSettings.crouchingSpeed = 7.75;
    }

    onDisable () {
        
        hooks.noa.serverSettings.crouchingSpeed = 2;
    }

    onGameEntered () {
        this.onEnable();
    }
};