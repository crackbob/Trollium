import Module from "../../module";
import hooks from "../../../hooks";
import mathUtils from "../../../utils/mathUtils";

export default class ItemReach extends Module {
    constructor () {
        super("ItemReach", "Pick up items from 5 blocks away", "Misc", null);
        this._getEntitiesInAABB;
    }

    onEnable () {
        if (hooks.noa?.ents) {
            this._getEntitiesInAABB = hooks.noa.ents.getEntitiesInAABB;
            hooks.noa.ents.getEntitiesInAABB = function (data, type) {
                if (type == "autoRotate") {
                    let items = [];
                    let localPlayerPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);
                    hooks.noa.ents._storage.itemState.list.forEach((item) => {
                        let itemPos = [...hooks.noa.ents.getPositionData(item.__id).position];
                        if (parseFloat(mathUtils.distanceBetweenSqrt(localPlayerPos, itemPos)) <= 7) {
                            items.push(item.__id);
                        }
                    })
                    return items;
                }
                return this._getEntitiesInAABB.apply(this, arguments);
            }
        }
    }

    onDisable () {
        if (hooks.noa?.ents && this._getEntitiesInAABB) {
            hooks.noa.ents.getEntitiesInAABB = this._getEntitiesInAABB;
        }
    }

    onGameTick () {
        if (hooks.noa.ents.getEntitiesInAABB !== this._getEntitiesInAABB) {
            this.onEnable();
        }
    }
}