import Module from "../../module";
import hooks from "../../../hooks";
import packets from "../../../utils/packets";

export default class IdentityCrisis extends Module {
    constructor () {
        super("IdentityCrisis", "Rapidly change skin", "Misc", {
            "Interval": 1
        });
        this.lastExecutionTime = 0;
        this.skinQueue = [];
        this.currentSkinIndex = 0;
    }

    onGameTick () {
        const interval = this.options.Interval;
        const currentTime = Date.now();

        if (this.skinQueue.length === 0) {
            this.refreshQueue();
        }

        if (this.skinQueue.length > 0 && currentTime - this.lastExecutionTime >= interval) {
            this.lastExecutionTime = currentTime;

            const { partType, skinName } = this.skinQueue[this.currentSkinIndex];

            hooks.sendPacket(packets.changeSkin, {
                partType,
                selected: skinName
            });

            this.currentSkinIndex = (this.currentSkinIndex + 1) % this.skinQueue.length;
        }
    }

    refreshQueue() {
        let skinOptions = Object.values(hooks.wpRequire(1728)).find(prop => prop?.head);
        Object.entries(skinOptions).forEach(([partType, skins]) => {
            Object.entries(skins).forEach(([skinName, skinDetails]) => {
                if (skinDetails.clientSelectable && partType !== "cape") {
                    this.skinQueue.push({ partType, skinName });
                }
            });
        });
    }
}