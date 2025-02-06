import Module from "../../module";
import hooks from "../../../hooks";

let _applyImpulse = null;
export default class Velocity extends Module {
    constructor () {
        super("Velocity", "Prevents player knockback.", "Movement", null, "KeyH")
    }

    get playerBody () {
        return hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
    }

    _applyImpulse = null;

    onGameTick() {
        _applyImpulse = _applyImpulse || this.playerBody.applyImpulse;
        this.playerBody.applyImpulse = function () {
            if (!hooks.noa.ents.getMoveState(hooks.noa.playerEntity).hitInPrevTick) {
                return _applyImpulse.apply(this, arguments);
            }
        }
    }

    onDisable () {
        this.playerBody.applyImpulse = _applyImpulse;
    }
};