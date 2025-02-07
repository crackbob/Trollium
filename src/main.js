import configManager from "./config/manager";
import moduleManager from "./module/moduleManager";
import events from "./events";
import gameUtils from './utils/gameUtils';
import hooks from "./hooks"
import mathUtils from "./utils/mathUtils";
import packets from "./utils/packets";

class Trollium {
    constructor() {
        this.version = "1.0.0";
        this.init();
    }

    init () {
            
        setInterval(() => {
            events.emit("render");
            
            if (hooks.noa?.ents.getHeldItem(hooks.noa.playerEntity)?.doAttack) {
                gameUtils.doAttack = hooks.noa.ents.getHeldItem(hooks.noa.playerEntity).doAttack.bind(hooks);
            }

        }, (1000 / 60));

        document.addEventListener("keydown", (e) => {
            events.emit("keydown", e.code);
        });

        hooks.init();
        moduleManager.init();

        window.gameUtils = gameUtils;
        window.mathUtils = mathUtils;
        window.hooks = hooks;
        window.packets = packets;
    }

    disable () {

    }
};

export default new Trollium();