import Module from "../../module";
import hooks from "../../../hooks";
import mathUtils from "../../../utils/mathUtils";
import gameUtils from "../../../utils/gameUtils";

export default class Aimbot extends Module {
    constructor () {
        super("Aimbot", "Targets camera at player.", "Combat", null, "")
        this.options = {
            "Target Closest Player": false
        }
    }

    onGameTick () {
        const localPlayerPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);

        if (this.options["Target Closest Player"]) {
            const closestPlayerPos = [...hooks.noa.ents.getPositionData(gameUtils.getClosestAttackablePlayer()).position];
            hooks.noa.camera._dirVector = mathUtils.normalizeVector([closestPlayerPos[0] - localPlayerPos[0], closestPlayerPos[1] - localPlayerPos[1], closestPlayerPos[2] - localPlayerPos[2]]);
        } else {
            gameUtils.getPlayerList().forEach((player) => {
                const targetPlayerPos = [...hooks.noa.ents.getPositionData(player).position];
                hooks.noa.camera._dirVector = mathUtils.normalizeVector([targetPlayerPos[0] - localPlayerPos[0], targetPlayerPos[1] - localPlayerPos[1], targetPlayerPos[2] - localPlayerPos[2]]);
            })
        }
    }
};