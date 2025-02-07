import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

export default class TargetStrafe extends Module {
    constructor() {
        super("Target Strafe", "Allows you to strafe around the target while attacking player.", "Combat", {
            "Lock-on Radius": 3,
            "Spin Radius": 1.5,
            "Spin Speed ": 0.1,
            "Speed": 2
        }, "");
        this.angle = 0;
    }

    onGameTick() {
        let playerPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);
        let target = [...hooks.noa.ents.getPositionData(gameUtils.getClosestAttackablePlayer())?.position || [0, 0, 0]];

        const distanceToTarget = Math.sqrt(
            (target[0] - playerPos[0]) ** 2 + 
            (target[2] - playerPos[2]) ** 2 
        );

        if (distanceToTarget < parseFloat(this.options["Lock-on Radius"]) && gameUtils.lastKillauraAttack > (Date.now() - 200) && gameUtils.onGround()) {

            if (!gameUtils.touchingWall()) {
                this.angle += parseFloat(this.options["Spin Speed "]);
            }

            const newX = target[0] + Math.cos(this.angle) * parseFloat(this.options["Spin Radius"]);
            const newZ = target[2] + Math.sin(this.angle) * parseFloat(this.options["Spin Radius"]);

            let playerPhysicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
            playerPhysicsBody.velocity[0] = (newX - playerPos[0]) * parseFloat(this.options["Speed"]);
            playerPhysicsBody.velocity[2] = (newZ - playerPos[2]) * parseFloat(this.options["Speed"]);
        }
    }
};