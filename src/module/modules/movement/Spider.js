import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

export default class Spider extends Module {
    constructor () {
        super("Spider", "Allows for climbing up walls.", "Movement", null)
    }

    onGameTick() {
        let playerPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);
        let blockCheckPos = playerPos.map(Math.floor);
        blockCheckPos[1] += 2;

        let solidBlockAbovePlayer = hooks.noa.registry.getBlockSolidity(hooks.noa.bloxd.getBlock(...blockCheckPos));
        let touchingWall = gameUtils.touchingWall();

        if ((solidBlockAbovePlayer || touchingWall) && hooks.noa.inputs.state.jump) {
            let playerPhysicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
            playerPhysicsBody.velocity[1] = hooks.noa.serverSettings.jumpAmount;
        }
    }
};