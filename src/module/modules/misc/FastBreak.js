import Module from "../../module";
import hooks from "../../../hooks";

export default class FastBreak extends Module {
    constructor () {
        super("FastBreak", "Break blocks 2 times faster.", "Misc", null);
        this.originalHardness = new Map();
        this.applied = false;
    }

    onEnable () {
        let blocks = Object.values(Object.values(hooks.findModule("Gun:class")).find(prop => typeof prop == "object"));

        if (!this.applied && blocks.length > 0) {
            blocks.forEach(block => {
                if (!this.originalHardness.has(block)) {
                    this.originalHardness.set(block, block.ttb);
                }
                if (block.ttb < 500) {
                    block.ttb /= 1.5;
                }
                if (block.ttb > 800) {
                    block.ttb /= 1.3;
                }
                if (block.ttb < 800 && block.ttb > 500) {
                    block.ttb /= 1.2;
                }
            });
            this.applied = true;
        }
    }

    onDisable () {
        let blocks = Object.values(Object.values(hooks.findModule("Gun:class")).find(prop => typeof prop == "object"));
        blocks.forEach(block => {
            if (this.originalHardness.has(block)) {
                block.ttb = this.originalHardness.get(block);
            }
        });
        this.applied = false;
        this.originalHardness.clear();
    }

    onGameTick () {
        if (!this.applied) {
            this.onEnable();
        }
    }
}