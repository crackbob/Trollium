import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

export default class Scaffold extends Module {
    constructor () {
        super("Scaffold", "Places blocks under you while walking or running.", "Movement", {
            "Y Lock": false
        }, "KeyC")
        this.yPosOnEnable = 0;
    }

    get inventory () {
        return hooks.noa.ents.getInventoryState(hooks.noa.playerEntity);
    }

    get heldItem () {
        return this.inventory.inventory.items.find(item => item?.typeObj.type == "CubeBlock") || null;
    }

    place(blockPos) {

        if (this.options["Y Lock"]) {
            blockPos[1] = this.yPosOnEnable;
        }
       
        if (hooks.noa.registry.getBlockSolidity(hooks.noa.bloxd.getBlock(...blockPos))) return false;

        // hold a block
        let heldItemIndex = this.inventory.inventory.items.findIndex(item => item?.typeObj.type == "CubeBlock");
        gameUtils.selectInventorySlot(heldItemIndex);

        if (!this.heldItem?.typeObj.id) return false;
        
        gameUtils.placeBlock(blockPos, this.heldItem);

        return true;
    }

    onEnable() {
        
        let physicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
        gameUtils.freezeValue(physicsBody, "preventFallOffEdge", true);

        // save block under player for Y lock
        this.yPosOnEnable = Math.floor(hooks.noa.ents.getPositionData(hooks.noa.playerEntity).position[1]) - 1;
    }

    onGameTick () {
        let playerPos = hooks.noa.ents.getPositionData(hooks.noa.playerEntity).position;
        let blockPos = playerPos.map(Math.floor);

        let isMoving = (hooks.noa.inputs.state.forward || hooks.noa.inputs.state.backward || hooks.noa.inputs.state.left || hooks.noa.inputs.state.right);

        // jumping and has blocks, do the tower thing
        if (hooks.noa.inputs.state.jump && this.heldItem?.typeObj.id && !isMoving && !this.options["Y Lock"]) {
            let physicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
            physicsBody.velocity[1] = hooks.noa.serverSettings.jumpAmount;
            this.place(blockPos);
        }

        blockPos[1]--;
        
        let movingX = Math.abs(playerPos[0] - blockPos[0] - 0.5) > 0.2;
        let movingZ = Math.abs(playerPos[2] - blockPos[2] - 0.5) > 0.2;
        
        // if moving diagonally
        if (movingX && movingZ) {
            let lastX = Math.floor(playerPos[0] - 0.5);
            let lastZ = Math.floor(playerPos[2] - 0.5);
            
            // place support block
            this.place([lastX, blockPos[1], lastZ]);
            // place diagonal block
            this.place(blockPos);

            if (hooks.noa.inputs.state.jump) {
                blockPos[1]--;
                // place support block
                this.place([lastX, blockPos[1], lastZ]);
                // place diagonal block
                this.place(blockPos);
            }
        } else {
            this.place(blockPos);
            
            if (hooks.noa.inputs.state.jump) {
                blockPos[1]--;
                this.place(blockPos);
            }
        }
    }

    onDisable () {
        let physicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
        gameUtils.unfreezeValue(physicsBody, "preventFallOffEdge");
    }
};