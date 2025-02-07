import Module from "../../module";
import hooks from "../../../hooks";

export default class NoClip extends Module {
    constructor () {
        super("NoClip", "Go through stuff.", "Movement", "", "KeyM")
    }

    get posData () {
        return hooks.noa.ents.getPositionData(hooks.noa.playerEntity);
    }

    onEnable () {
        this.posData.width = 0;
        this.posData.height = 0;
    }

    onGameTick () {
        if (hooks.noa.inputs.state.jump) {
            this.posData.position[1] += 0.5;
            hooks.noa.ents.setPosition(hooks.noa.playerEntity, this.posData.position)
        }

        if (hooks.noa.inputs.state.crouch) {
            this.posData.position[1] -= 0.5;
            hooks.noa.ents.setPosition(hooks.noa.playerEntity, this.posData.position)
        }
    }

    onDisable () {
        this.posData.width = 0.5;
        this.posData.height = 1.8;
    }

    onGameEntered () {
        this.onEnable();
    }
};