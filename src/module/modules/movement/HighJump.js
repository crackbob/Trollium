import Module from "../../Module";
import hooks from "../../../hooks";
import moduleManager from "../../moduleManager";

export default class HighJump extends Module {
    constructor () {
        super("High Jump", "Jump really high off ladders.", "Movement", null, "KeyF")
    }

    onEnable () {
        if (!gameUtils.inGame) return;
        let physicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
        let inventory = hooks.noa.ents.getInventoryState(hooks.noa.playerEntity);
        let playerPos = hooks.noa.ents.getPositionData(hooks.noa.playerEntity).position;
        let heldItem = inventory.inventory.items.find(item => item?.name.toLowerCase().includes("ladder")) || null;
        let heldItemIndex = inventory.inventory.items.findIndex(item => item?.name.toLowerCase().includes("ladder"));
        let blockPos = playerPos.map(Math.floor);

        physicsBody.velocity[1] = 40;

        if (heldItem && heldItemIndex) {
            hooks.noa.bloxd.setBlock(...blockPos, heldItem.typeObj.id);

            // remove the block you placed from your inventory
            inventory.inventory.removeItem(inventory.inventory.items.findIndex(item => item == heldItem), 1)

            // hold a block
            gameUtils.selectInventorySlot(heldItemIndex);

            hooks.wpRequire(503).Sb(53, {
                pos: blockPos,
                toBlock: heldItem.typeObj.id,
                checker: ""
            }, !0)
        }

        setTimeout(() => {
            if (moduleManager.modules["High Jump"].isEnabled) {
                moduleManager.modules["High Jump"].toggle();
            }
        }, 1000)
    }
};