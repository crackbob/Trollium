import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

export default class SafeWalk extends Module {
    constructor () {
        super("SafeWalk", "Don't fall off blocks", "Movement", null)
    }

    onEnable () {
        
        let physicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
        gameUtils.freezeValue(physicsBody, "preventFallOffEdge", true);
    }

    onDisable () {
        
        let physicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
        gameUtils.unfreezeValue(physicsBody, "preventFallOffEdge");
    }

    onGameEntered () {
        this.onEnable();
    }
};