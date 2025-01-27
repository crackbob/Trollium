import Module from "../../Module";
import hooks from "../../../hooks";

export default class Spider extends Module {
    constructor () {
        super("Spider", "Allows for climbing up walls.", "Movement", null, "")
    }

    onGameTick() {
        let playerPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);
        let blockCheckPos = playerPos.map(Math.floor);

        blockCheckPos[1]++;

        playerPos.forEach((coord, index) => {
            let tolerance = 5;
            let decimalPart = parseInt(coord.toString().split(".")[1]?.substring(0, 2) || 0);


            if (decimalPart >= 25 - tolerance && decimalPart <= 25 + tolerance) {
                blockCheckPos[index]--;
            }

            if (decimalPart >= 75 - tolerance && decimalPart <= 75 + tolerance) {
                blockCheckPos[index]++;
            }
        });

        if (hooks.noa.registry.getBlockSolidity(hooks.noa.bloxd.getBlock(...blockCheckPos)) && hooks.noa.inputs.state.jump) {
            let playerPhysicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
            playerPhysicsBody.velocity[1] = hooks.noa.serverSettings.jumpAmount;
        }
    }
};