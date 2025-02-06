import Module from "../../module";
import hooks from "../../../hooks";

export default class AntiSpike extends Module {
    constructor () {
        super("Anti Spike", "Don't fall on spikes", "Movement", null, "")
    }

    onEnable () {
        if (!gameUtils.inGame) return;
        let blocks = Object.values(Object.values(hooks.findModule("Gun:class")).find(prop => typeof prop == "object"));
        blocks.filter(block => block.name.includes("Spikes")).forEach(function (block) {
            hooks.noa.registry._solidityLookup[block.id] = true;
        });
    }

    onDisable () {
        if (!gameUtils.inGame) return;
        let blocks = Object.values(Object.values(hooks.findModule("Gun:class")).find(prop => typeof prop == "object"));
        blocks.filter(block => block.name.includes("Spikes")).forEach(function (block) {
            hooks.noa.registry._solidityLookup[block.id] = false;
        });
    }

    onEnterWorld () {
        this.onEnable();
    }
};