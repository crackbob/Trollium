import Module from "../../module";
import hooks from "../../../hooks";
import moduleManager from "../../moduleManager";
import gameUtils from "../../../utils/gameUtils";

export default class HighJump extends Module {
    constructor () {
        super("HighJump", "Jump really high.", "Movement", null, "KeyF")
    }

    onEnable () {
        
        let physicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
        let currentPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity).map(Math.floor);

        // put player in the center of the block
        currentPos[0] += 0.5;
        currentPos[2] += 0.5;
        hooks.noa.ents.setPosition(hooks.noa.playerEntity, currentPos);

        
        physicsBody.velocity[1] = 40;

        setTimeout(() => {
            if (moduleManager.modules["HighJump"].isEnabled) {
                moduleManager.modules["HighJump"].toggle();
            }
        }, 1000)
    }
};