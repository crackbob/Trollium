import Module from "../../module";
import hooks from "../../../hooks";

export default class AntiRecoil extends Module {
    constructor () {
        super("AntiRecoil", "Prevents gun from recoiling.", "Combat", null)
    }

    onGameTick () {
        let inventoryState = hooks.noa.ents.getInventoryState(hooks.noa.playerEntity);
        let selectedItem = inventoryState.inventory.items[inventoryState.inventory.getSelectedSlotIndex()]?.typeObj || [];
        Object.keys(selectedItem).forEach(function (key) {
            if (key.includes("accuracy") || key.includes("ickback")) {
                selectedItem[key] = 0;
            }
        });
    }
};