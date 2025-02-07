import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";
export default class Speed extends Module {
    constructor () {
        super("Speed", "Run faster", "Movement", null, "KeyG")
    }
    onEnable () {
        let realSpeed = 0;
        let moveState = hooks.noa.ents._storage.moveState.list[hooks.noa.playerEntity];
        moveState.__defineGetter__("speed", () => {
            if (hooks.noa.inputs.state.forward) {
                return 7;
            }
            return realSpeed;
        })
        moveState.__defineSetter__("speed", (value) => {
            realSpeed = value;
        })
        hooks.noa.serverSettings.walkingSpeed = 8;
        hooks.noa.serverSettings.runningSpeed = 10;
    }
    onDisable () {
        let moveState = hooks.noa.ents._storage.moveState.list[hooks.noa.playerEntity];
        delete moveState.speed;
        moveState.speed = 0;
        hooks.noa.serverSettings.walkingSpeed = 4;
        hooks.noa.serverSettings.runningSpeed = 7;
    }
    onGameTick () {
        let physicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
        if (physicsBody.atRestY() < 0 && !hooks.noa.inputs.state.jump) {
            physicsBody.velocity[1] = 0.8;
        }
    }
};