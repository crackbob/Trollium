import Module from "../../module";
import hooks from "../../../hooks";

export default class Wireframe extends Module {
    constructor () {
        super("Wireframe", "Enables wireframe visual settings.", "Visual", null, "KeyX")
    }

    onEnable () {
        
        hooks.noa.rendering.scene.forceWireframe = true;
    }

    onDisable () {
        
        hooks.noa.rendering.scene.forceWireframe = false;
    }
};