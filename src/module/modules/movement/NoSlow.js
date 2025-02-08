import Module from "../../module";
import hooks from "../../../hooks";

export default class NoSlow extends Module {
    constructor () {
        super("NoSlow", "be fast", "Movement", null)
    }

    onEnable () {
        this._isInCobweb = this._isInCobweb || hooks.noa.ents.getMovement(1).isInCobweb;
        hooks.noa.ents.getMovement(1).isInCobweb = () => false;
        hooks.noa.serverSettings.crouchingSpeed = 7.75;
    }

    onDisable () {
        hooks.noa.ents.getMovement(1).isInCobweb = this._isInCobweb;
        hooks.noa.serverSettings.crouchingSpeed = 2;
    }

    onGameEntered () {
        this.onEnable();
    }
};