import Module from "../../Module";
import hooks from "../../../hooks";

export default class Wireframe extends Module {
    constructor () {
        super("Wireframe", "Enables wireframe visual settings.", "Visual", null, "KeyX")
    }

    onEnable () {
        if (!gameUtils.inGame) return;
        hooks.noa.rendering.scene.forceWireframe = true;
    }

    onDisable () {
        if (!gameUtils.inGame) return;
        hooks.noa.rendering.scene.forceWireframe = false;
    }
};