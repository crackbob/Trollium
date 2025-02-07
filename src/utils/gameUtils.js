import hooks from "../hooks";
import mathUtils from "./mathUtils";
import packets from "./packets";

export default {
    getPlayerList() {
        return Object.values(hooks.noa.bloxd.getPlayerIds()).filter(player => player !== hooks.noa.playerEntity && hooks.noa.ents.hasComponent(player, "position")).map(id => parseInt(id));
    },

    isPlayerAlive(id) {
        return hooks.noa.ents.getGenericLifeformState(id).isAlive;
    },

    canAttackPlayer(id) {
        return hooks.noa.otherEntitySettings[hooks.noa.playerEntity][id]?.canAttack || false;
    },

    getClosestPlayer() {
        const localPlayerPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);
        let closestPlayer = undefined;
        let closestDistance = undefined;

        for (const player of this.getPlayerList()) {
            const distance = mathUtils.distanceBetween(localPlayerPos, hooks.noa.ents.getPosition(player));
            if (!closestPlayer || distance < closestDistance) {
                closestPlayer = player;
                closestDistance = distance;
            }
        }
        return closestPlayer;
    },

    getClosestAttackablePlayer() {
        const localPlayerPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);
        let closestPlayer = undefined;
        let closestDistance = undefined;

        for (const player of this.getPlayerList()) {
            const distance = mathUtils.distanceBetween(localPlayerPos, hooks.noa.ents.getPosition(player));
            let isAlive = this.isPlayerAlive(player);
            let canAttack = this.canAttackPlayer(player);

            if (!closestPlayer || distance < closestDistance && isAlive && canAttack) {
                closestPlayer = player;
                closestDistance = distance;
            }
        }
        return closestPlayer;
    },

    touchingWall () {
        let playerPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);
        let blockCheckPos = playerPos.map(Math.floor);
        
        blockCheckPos[1]++;
        
        playerPos.forEach((coord, index) => {
            let tolerance = 5;
            let decimalPart = parseInt(coord.toString().split(".")[1]?.substring(0, 2) || 0);
        
        
            if (decimalPart >= 25 - tolerance && decimalPart <= 25 + tolerance) {
                blockCheckPos[index]--;
            }
        
            if (decimalPart >= 75 - tolerance && decimalPart <= 75 + tolerance) {
                blockCheckPos[index]++;
            }
        });
        
        return hooks.noa.registry.getBlockSolidity(hooks.noa.bloxd.getBlock(...blockCheckPos));
    },

    onGround () {
        return hooks.noa.ents.getPhysicsBody(hooks.noa.playerEntity).atRestY() < 0;
    },

    inGame: false,

    freezeValue(obj, prop, value) {
        obj.__defineGetter__(prop, () => value);
        obj.__defineSetter__(prop, () => value);
    },

    unfreezeValue(obj, prop) {
        delete obj[prop];
    },

    selectInventorySlot(index) {
        hooks.noa.ents.getInventoryState(hooks.noa.playerEntity).inventory.setSelectedSlotIndex(index);
        hooks.sendPacket(56, index);
    },

    getPlayerName(id) {
        return hooks.noa.bloxd.entityNames[id].entityName;
    },

    placeBlock (blockPosition, heldItem) {       
        let checker = Object.values(hooks.findModule("checker:")).find(fn => fn.toString().includes("()=>("))();

        hooks.sendPacket(packets.placeBlock, {
            pos: blockPosition,
            toBlock: heldItem.typeObj.id,
            checker: checker
        }, !0);
        
        hooks.noa.bloxd.setBlock(...blockPosition, heldItem.typeObj.id);
        
        // remove the block you placed from your inventory
        let inventory = hooks.noa.ents.getInventoryState(hooks.noa.playerEntity).inventory;
        if (!hooks.noa.serverSettings.creative) {
            inventory.removeItem(inventory.items.findIndex(item => item == heldItem), 1);
        }
    },

    "lastKillauraAttack": 0
};