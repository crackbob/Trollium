import Module from "../../module";
import hooks from "../../../hooks";
import mathUtils from "../../../utils/mathUtils";
import gameUtils from "../../../utils/gameUtils";

export default class Killaura extends Module {
    constructor () {
        super("KillAura", "Targets and kills players within 10 block radius.", "Combat", {
            "Criticals": true
        }, "KeyK")
    }

    onGameTick () {

        let physicsBody = hooks.noa.entities.getPhysicsBody(hooks.noa.playerEntity);
        let localPlayerPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);
        let inventory = hooks.noa.ents.getInventoryState(hooks.noa.playerEntity).inventory.items;
        let playerList = gameUtils.getPlayerList();
        playerList.forEach(function (player) {

            let targetPosition = hooks.noa.ents.getPosition(player);
            if (!targetPosition) return;

            // player checks
            let withinReach = parseFloat(mathUtils.distanceBetweenSqrt(localPlayerPos, targetPosition)) <= 7;
            let isAlive = gameUtils.isPlayerAlive(player);
            let canAttack = gameUtils.canAttackPlayer(player);
            let isBlacklisted = gameUtils.getPlayerName(player).toLowerCase().includes("faze_");

            if (withinReach && isAlive && canAttack && !isBlacklisted) {

                // find the strongest sword, make sure you aren't already holding it, then select it.
                let swords = inventory.filter(item => item?.name.includes("Sword"));
                let strongestSword = swords.reduce((maxItem, currentItem) => {
                    return (currentItem.typeObj?.damage > (maxItem?.typeObj?.damage || 0)) ? currentItem : maxItem;
                }, null);

                let swordIndex = inventory.findIndex(item => item == strongestSword);
                let selectedSlot = hooks.noa.ents.getInventoryState(hooks.noa.playerEntity).inventory._selectedSlotI;

                if (swordIndex !== null && selectedSlot !== swordIndex) {
                    gameUtils.selectInventorySlot(swordIndex);
                }

                let lookPos = mathUtils.normalizeVector([targetPosition[0] - localPlayerPos[0], targetPosition[1] - localPlayerPos[1], targetPosition[2] - localPlayerPos[2]]);
                gameUtils.doAttack(lookPos, player.toString(), "BodyMesh");
                gameUtils.lastKillauraAttack = Date.now();
            }
        })

        if (this.options["Criticals"] && physicsBody.atRestY() < 0) {
            physicsBody.velocity[1] = 0.5;
        }
    }
};