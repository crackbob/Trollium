import Module from "../../Module";
import hooks from "../../../hooks";
import mathUtils from "../../../utils/mathUtils";

export default class Fill extends Module {
    constructor () {
        super("Fill", "Fill Blocks", "Misc", null, "");
        this.delay = 300;
        this.index = 0;
        this.radius = 5;
        this.blockPositions = [];
    }

    onEnable () {
        if (hooks.noa.serverSettings.creative) {
            this.delay = 10;
            this.radius = 5;
        } else {
            this.delay = 300;
            this.radius = 3;
        }
    }

    onGameTick () {
        let playerPos = hooks.noa.ents.getPositionData(hooks.noa.playerEntity).position;
        let blockPos = playerPos.map(Math.floor);
        let heldItem = hooks.noa.ents.getHeldItem(hooks.noa.playerEntity);

        blockPos[1] -= (this.radius + 1);

        if (!heldItem?.typeObj) return;

        this.blockPositions = [];
        for (let x = -this.radius; x <= this.radius; x++) {
            for (let y = -this.radius; y <= this.radius; y++) {
                for (let z = -this.radius; z <= this.radius; z++) {
                    const [cx, cy, cz] = [blockPos[0] + x, blockPos[1] + y, blockPos[2] + z];
                    const currentBlock = hooks.noa.bloxd.getBlock(cx, cy, cz);
                    if (!hooks.noa.registry.getBlockSolidity(currentBlock)) {
                        this.blockPositions.push([cx, cy, cz]);
                    }
                }
            }
        }

        this.index = 0;
        this.placeNextBlock(heldItem);
    }

    placeNextBlock(heldItem) {
        if (this.index >= this.blockPositions.length) return;

        const [cx, cy, cz] = this.blockPositions[this.index];
        gameUtils.placeBlock([cx, cy, cz], heldItem);
        this.index++;

        setTimeout(() => {
            this.placeNextBlock(heldItem);
        }, this.delay);
    }
}