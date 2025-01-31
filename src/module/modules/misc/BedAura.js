import Module from "../../Module";
import hooks from "../../../hooks";

export default class BedAura extends Module {
    constructor () {
        super("BedAura", "Break beds automatically", "Misc")
        this.blocks = null;
    }

    onGameTick () {
        if (!this.blocks) {
            this.blocks = Object.values(Object.values(hooks.findModule("Gun:class"))
                .find(prop => typeof prop == "object"));
        }

        let heldItem = hooks.noa.ents.getHeldItem(hooks.noa.playerEntity);
        let playerPos = hooks.noa.ents.getPositionData(hooks.noa.playerEntity).position;
        let blockPos = playerPos.map(Math.floor);

        const spoofedTargetBlock = {
            position: {},
            adjacent: {},
            normal: {},
            blockID: 0,
            spoofed: true
        }

        const maxRadius = 5;
        let found = this.search(blockPos, maxRadius, spoofedTargetBlock);

        if (found) {
            hooks.noa.__defineGetter__("targetedBlock", () => spoofedTargetBlock);
            hooks.noa.__defineSetter__("targetedBlock", () => spoofedTargetBlock);
            heldItem.breaking = true;
        } else {
            if (hooks.noa?.targetedBlock?.spoofed) {
                delete hooks.noa.targetedBlock;
                heldItem.breaking = false;
            }
        }
    }

    search(blockPos, maxRadius, spoofedTargetBlock) {
        for (let r = 1; r <= maxRadius; r++) {
            for (let y = -r; y <= r; y++) {
                for (let x = -r; x <= r; x++) {
                    for (let z = -r; z <= r; z++) {
                        if (Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) != r) continue;

                        let currentBlock = hooks.noa.bloxd.getBlock(
                            blockPos[0] + x,
                            blockPos[1] + y,
                            blockPos[2] + z
                        );
                        
                        if (this.blocks[currentBlock]?.name.toLowerCase().includes("bed")) {
                            spoofedTargetBlock.position = [
                                blockPos[0] + x,
                                blockPos[1] + y,
                                blockPos[2] + z
                            ];
                            spoofedTargetBlock.adjacent = [
                                blockPos[0] + x,
                                blockPos[1] + y + 1,
                                blockPos[2] + z
                            ];
                            spoofedTargetBlock.normal = [
                                0,
                                0,
                                0
                            ]
                            spoofedTargetBlock.blockID = this.blocks[currentBlock].id;
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
};