import Module from "../../module";
import hooks from "../../../hooks";

export default class Freeze extends Module {
    constructor () {
        super("Freeze", "Freeze player movement", "Movement", null, "")
    }

    onEnable () {
        if (!gameUtils.inGame) return;
        hooks.noa.ents.getPhysicsBody(hooks.noa.playerEntity).mass = 0;
    }

    onDisable () {
        if (!gameUtils.inGame) return;
        hooks.noa.ents.getPhysicsBody(hooks.noa.playerEntity).mass = 1;
    }

    onEnterWorld () {
        this.onEnable();
    }
};