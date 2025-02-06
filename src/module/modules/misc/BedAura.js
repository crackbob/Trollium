import Module from "../../module";
import hooks from "../../../hooks";
export default class BedAura extends Module {
    constructor () {
        super("BedAura", "Break beds automatically", "Misc")
        this.lastPosition = [0, 0, 0];
        this.spoofedTargetBlock = {
            position: {},
            id: 0,
            spoofed: true,
            adjacent: [],
            normal: [0, 0, 0]
        };
    }

    hasMovedSignificantly(currentPos) {
        return this.lastPosition.some((coord, i) => 
            Math.abs(coord - currentPos[i]) >= 0.5
        );
    }

    onGameTick () {
        const playerPos = hooks.noa.ents.getPositionData(hooks.noa.playerEntity).position;
        const blockPos = playerPos.map(Math.floor);
        const heldItem = hooks.noa.ents.getHeldItem(hooks.noa.playerEntity);

        const blocks = Object.values(Object.values(hooks.findModule("Gun:class")).find(prop => typeof prop === "object"));

        if (this.spoofedTargetBlock.spoofed) {
            if (!blocks[this.spoofedTargetBlock.blockID] || !hooks.noa.bloxd.getBlock(this.spoofedTargetBlock.position[0], this.spoofedTargetBlock.position[1], this.spoofedTargetBlock.position[2])) {
                delete hooks.noa.targetedBlock;
                heldItem.breaking = false;
                this.spoofedTargetBlock.spoofed = false;
                return;
            }
        }

        if (!this.hasMovedSignificantly(playerPos)) {
            return;
        }

        this.lastPosition = [...playerPos];

        let blockFound = false;

        searchLoop: for (let x = -5; x <= 5; x++) {
            for (let y = -5; y <= 5; y++) {
                for (let z = -5; z <= 5; z++) {
                    const [cx, cy, cz] = [blockPos[0] + x, blockPos[1] + y, blockPos[2] + z];
                    const currentBlock = hooks.noa.bloxd.getBlock(cx, cy, cz);
                    
                    if (blocks[currentBlock]?.name.toLowerCase().includes("bed")) {
                        this.spoofedTargetBlock.position = [cx, cy, cz];
                        this.spoofedTargetBlock.adjacent = [cx, cy + 1, cz];
                        this.spoofedTargetBlock.blockID = blocks[currentBlock].id;
                        this.spoofedTargetBlock.spoofed = true;
                        blockFound = true;
                        break searchLoop;
                    }
                }
            }
        }

        if (blockFound) {
            Object.defineProperty(hooks.noa, 'targetedBlock', {
                get: () => this.spoofedTargetBlock,
                set: () => this.spoofedTargetBlock,
                configurable: true
            });
            heldItem.breaking = true;
        }
    }
};