import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

export default class BoatFly extends Module {
    constructor () {
        super("BoatFly", "Fly with a boat", "Movement")
    }

    getBoatSpeed = null;
    lastExecutionTime = 0;

    onGameTick () {
        let delay = 800;
        this.getBoatSpeed = this.getBoatSpeed || Object.values(hooks.findModule("getVehicleMoveSpeedMult:"))[0][1].getVehicleMoveSpeedMult;
        Object.values(hooks.findModule("getVehicleMoveSpeedMult:"))[0][1].getVehicleMoveSpeedMult = () => 10;
        let targetYVel = 3;

        let currentTime = Date.now();
        let elapsedTime = currentTime - this.lastExecutionTime;

        if (hooks.noa.inputs.state.jump) {
            targetYVel = 10;
            delay = 300;
        }

        if (!hooks.noa.inputs.state.forward && !hooks.noa.inputs.state.jump) {
            delay = 200;
        }

        gameUtils.secondaryAction = gameUtils.secondaryAction || hooks.noa.ents.getHeldItem(hooks.noa.playerEntity).secondaryDownFireRepeatableAction.bind(hooks.noa.ents.getHeldItem(hooks.noa.playerEntity));

        if (elapsedTime >= delay && hooks.noa.entities.getStatesList("movement")[0].vehicle.type == 1) {
            hooks.noa.camera._dirVector[1] = -2;
            gameUtils.secondaryAction();
            hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity).velocity[1] = targetYVel;
            gameUtils.secondaryAction();
            this.lastExecutionTime = currentTime;
        }
    }

    onDisable () {
        hooks.wpRequire(2337).e[1].getVehicleMoveSpeedMult = () => this.getBoatSpeed
    }
};
