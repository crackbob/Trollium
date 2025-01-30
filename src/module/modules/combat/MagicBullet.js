import Module from "../../Module";
import hooks from "../../../hooks";
import mathUtils from "../../../utils/mathUtils";
import gameUtils from "../../../utils/gameUtils";

export default class MagicBullet extends Module {
    constructor () {
        super("Magic Bullet", "Beam people from across the map", "Combat", null, "")
        this._fireBullet;
        this.targetPlayer = "";
    }

    get heldItem () {
        return hooks.noa.ents.getHeldItem(hooks.noa.playerEntity);
    }

    onEnable () {
        if (!gameUtils.inGame) return;

        let getTargetPlayer = () => this.targetPlayer.toString();
        this.heldItem.fireBullet = function () {
            let retVal = this.__proto__.fireBullet.apply(this, arguments);
            retVal.hitResult = 0;
            retVal.hitEId = getTargetPlayer();
            retVal.meshNodeHit = "HeadMesh";
            return retVal;
        }
    }

    onGameTick () {
        this.targetPlayer = gameUtils.getClosestAttackablePlayer();

        if (this.heldItem.fireBullet == this.heldItem.__proto__.fireBullet) {
            this.onEnable();
        }
    }

    onDisable () {
        if (!gameUtils.inGame) return;
        this.heldItem.fireBullet = this.heldItem.__proto__.fireBullet.bind(this.heldItem);
    }
};