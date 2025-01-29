import Module from "../../Module";
import hooks from "../../../hooks";
import moduleManager from "../../moduleManager";
import gameUtils from "../../../utils/gameUtils";

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

            // hold a ladder
            gameUtils.selectInventorySlot(heldItemIndex);

            gameUtils.placeBlock(blockPos, heldItem);
        }

        setTimeout(() => {
            if (moduleManager.modules["High Jump"].isEnabled) {
                moduleManager.modules["High Jump"].toggle();
            }
        }, 1000)
    }
};