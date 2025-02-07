import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

export default class FireballFly extends Module {
    constructor () {
        super("FireballFly", "Fly with fireballs.", "Movement", {
            "Fly Speed": 100
        }, "KeyV")
    }

    getBoatSpeed = null;
    lastExecutionTime = 0;

    onEnable() {
        let inventory = hooks.noa.ents.getInventoryState(hooks.noa.playerEntity);
        let heldItemIndex = inventory.inventory.items.findIndex(item => item?.name.toLowerCase().includes("fire"));
    
        if (heldItemIndex !== null) {
            hooks.noa.camera._dirVector[1] = -2;
            gameUtils.selectInventorySlot(heldItemIndex);
            hooks.noa.ents.getHeldItem(hooks.noa.playerEntity).secondaryDownFireRepeatableAction();
        }

        hooks.noa.serverSettings.walkingSpeed = parseFloat(this.options["Fly Speed"]);
        hooks.noa.serverSettings.runningSpeed = parseFloat(this.options["Fly Speed"]);
    }

    onGameTick () {
        let physicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
        physicsBody.gravityMultiplier = 0;
        let currentVelY = physicsBody.velocity[1];
        let targetVelY = 0;
        if (hooks.noa.inputs.state.jump) {
            targetVelY = 6;
        } else if (hooks.noa.inputs.state.crouch) {
            targetVelY = -6;
        }
    
        physicsBody.velocity[1] = currentVelY + (targetVelY - currentVelY) * 0.1;
    
        if (!hooks.noa.inputs.state.jump && !hooks.noa.inputs.state.crouch) {
            physicsBody.velocity[1] = 0;
        }
    }

    onDisable () {
        let physicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
        physicsBody.gravityMultiplier = 1;
        physicsBody.velocity[1] = 0;
        hooks.noa.serverSettings.walkingSpeed = 7;
        hooks.noa.serverSettings.runningSpeed = 7;
    }
};