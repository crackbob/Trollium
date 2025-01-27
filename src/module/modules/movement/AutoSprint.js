import Module from "../../Module";
import hooks from "../../../hooks";

export default class AutoSprint extends Module {
    constructor () {
        super("Auto Sprint", "Sets your movement to always sprint, and slight speed boost.", "Movement", null, "")
    }

    onEnable () {
        if (!gameUtils.inGame) return;
        hooks.noa.serverSettings.walkingSpeed = 7.75;
        hooks.noa.serverSettings.runningSpeed = 7.75;
    }

    onDisable () {
        if (!gameUtils.inGame) return;
        hooks.noa.serverSettings.walkingSpeed = 4;
        hooks.noa.serverSettings.runningSpeed = 7;
    }

    onEnterWorld () {
        this.onEnable();
    }
};