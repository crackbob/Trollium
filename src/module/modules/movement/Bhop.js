import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

export default class Bhop extends Module {
    constructor () {
        super("Bhop", "Hop like a bunny.", "Movement", null)
    }

    get playerMovement () {
        return hooks.noa.ents.getMovement(hooks.noa.playerEntity);
    }

    onGameTick () {
        gameUtils.freezeValue(this.playerMovement, "onGroundPrevTick", !hooks.noa.inputs.state.jump);
        gameUtils.freezeValue(this.playerMovement, "_hadJumpInputPrevTick", !hooks.noa.inputs.state.jump);
    }

    onDisable () {
        gameUtils.unfreezeValue(this.playerMovement, "onGroundPrevTick");
        gameUtils.unfreezeValue(this.playerMovement, "_hadJumpInputPrevTick");
    }
};