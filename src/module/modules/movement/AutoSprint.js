import Module from "../../module";
import hooks from "../../../hooks";

export default class AutoSprint extends Module {
    constructor () {
        super("AutoSprint", "Sets your movement to always sprint, and slight speed boost.", "Movement", null)
    }

    onEnable () {
        
        hooks.noa.serverSettings.walkingSpeed = 7.75;
        hooks.noa.serverSettings.runningSpeed = 7.75;
    }

    onDisable () {
        
        hooks.noa.serverSettings.walkingSpeed = 4;
        hooks.noa.serverSettings.runningSpeed = 7;
    }

    onGameEntered () {
        this.onEnable();
    }
};