import Module from "../../module";
import hooks from "../../../hooks";

export default class AntiSpike extends Module {
    constructor () {
        super("AntiSpike", "Don't fall on spikes", "Movement", null)
    }

    onEnable () {
        let blocks = Object.values(Object.values(hooks.findModule("Gun:class")).find(prop => typeof prop == "object"));
        blocks.filter(block => block.name.includes("Spikes")).forEach(function (block) {
            hooks.noa.registry._solidityLookup[block.id] = true;
        });
    }

    onDisable () {
        let blocks = Object.values(Object.values(hooks.findModule("Gun:class")).find(prop => typeof prop == "object"));
        blocks.filter(block => block.name.includes("Spikes")).forEach(function (block) {
            hooks.noa.registry._solidityLookup[block.id] = false;
        });
    }

    onGameEntered () {
        this.onEnable();
    }
};