import Module from "../../module";
import hooks from "../../../hooks";
import mathUtils from "../../../utils/mathUtils";
import gameUtils from "../../../utils/gameUtils";

export default class Aimbot extends Module {
    constructor () {
        super("Aimbot", "Targets camera at player.", "Combat", {
            "Require Click": true,
            "Target Closest Player": true,
            "Turn Camera": true
        }, "")
    }

    aimAtPos (targetPos) {
        let localPlayerPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);
        let normalizedVector = mathUtils.normalizeVector([targetPos[0] - localPlayerPos[0], targetPos[1] - localPlayerPos[1], targetPos[2] - localPlayerPos[2]]);

        if (this.options["Turn Camera"]) {
            hooks.noa.camera.heading = Math.atan2(normalizedVector[0], normalizedVector[2]);
            hooks.noa.camera.pitch = Math.asin(-normalizedVector[1]);
        }

        hooks.noa.camera._dirVector = normalizedVector;
    }

    onGameTick () {
        if (this.options["Require Click"] && !hooks.noa.inputs.state.fire) return;

        if (this.options["Target Closest Player"]) {
            this.aimAtPos(hooks.noa.ents.getPositionData(gameUtils.getClosestAttackablePlayer()).position);
        } else {
            gameUtils.getPlayerList().forEach((player) => {
                this.aimAtPos(hooks.noa.ents.getPositionData(player).position);
            })
        }
    }
};