import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

export default class Jesus extends Module {
    constructor () {
        super("Jesus", "Walk on water", "Movement", null)
    }

    onGameTick () {
        let blocks = Object.values(Object.values(hooks.findModule("Gun:class")).find(prop => typeof prop == "object"));
        hooks.noa.registry._solidityLookup[blocks.find(block => block.name == "Water").id] = true;
        hooks.noa.registry._solidityLookup[blocks.find(block => block.name == "Lava").id] = true;
    }

    onDisable () {
        let blocks = Object.values(Object.values(hooks.findModule("Gun:class")).find(prop => typeof prop == "object"));
        hooks.noa.registry._solidityLookup[blocks.find(block => block.name == "Water").id] = false;
        hooks.noa.registry._solidityLookup[blocks.find(block => block.name == "Lava").id] = false;
    }
};