import Module from "../../Module";
import hooks from "../../../hooks";

export default class BedAura extends Module {
    constructor () {
        super("BedAura", "Break beds automatically", "Misc")
    }

    onGameTick () {
        let blocks = Object.values(Object.values(hooks.findModule("Gun:class")).find(prop => typeof prop == "object"));
        let heldItem = hooks.noa.ents.getHeldItem(hooks.noa.playerEntity);
        let playerPos = hooks.noa.ents.getPositionData(hooks.noa.playerEntity).position;
        let blockPos = playerPos.map(Math.floor);
        let blockFound = false;

        let spoofedTargetBlock = {
            position: {},
            id: 0,
            spoofed: true
        }

        for (let x = -5; x <= 5; x++) {
            for (let y = -5; y <= 5; y++) {
                for (let z = -5; z <= 5; z++) {
                    let currentBlock = hooks.noa.bloxd.getBlock(blockPos[0] + x, blockPos[1] + y, blockPos[2] + z);
                    if (blocks[currentBlock].name.toLowerCase().includes("bed")) {
                        spoofedTargetBlock.position = [blockPos[0] + x, blockPos[1] + y, blockPos[2] + z];
                        spoofedTargetBlock.id = blocks[currentBlock].id;
                        blockFound = true;
                        break;
                    }
                }
                if (blockFound) break;
            }
            if (blockFound) break;
        }

        if (blockFound) {
            hooks.noa.__defineGetter__("targetedBlock", () => spoofedTargetBlock);
            hooks.noa.__defineSetter__("targetedBlock", () => spoofedTargetBlock);
            heldItem.breaking = true
        } else {
            if (hooks.noa?.targetedBlock?.spoofed) {
                delete hooks.noa.targetedBlock;
                heldItem.breaking = false;
            }
        }
    }
};