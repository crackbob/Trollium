import Module from "../../Module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

export default class TargetStrafe extends Module {
    constructor() {
        super("Target Strafe", "Allows you to strafe around the target while attacking player.", "Combat", null, "");
        this.angle = 0;
        this.radius = 1.5;
    }

    onGameTick() {
        let playerPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);
        let target = [...hooks.noa.ents.getPositionData(gameUtils.getClosestAttackablePlayer())?.position || [0, 0, 0]];

        const distanceToTarget = Math.sqrt(
            (target[0] - playerPos[0]) ** 2 + 
            (target[2] - playerPos[2]) ** 2 
        );

        if (distanceToTarget < 3.5 && gameUtils.lastKillauraAttack > (Date.now() - 200) && gameUtils.onGround()) {

            if (!gameUtils.touchingWall()) {
                this.angle += 0.1;
            }

            const newX = target[0] + Math.cos(this.angle) * this.radius;
            const newZ = target[2] + Math.sin(this.angle) * this.radius;

            const speed = hooks.noa.serverSettings.walkingSpeed / 2;

            if (hooks.noa.entities.getStatesList("movement")[0].vehicle.type == 1) {
                speed = 8;
            }

            let playerPhysicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
            playerPhysicsBody.velocity[0] = (newX - playerPos[0]) * speed;
            playerPhysicsBody.velocity[2] = (newZ - playerPos[2]) * speed;
        }
    }
};