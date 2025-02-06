import configManager from "./config/manager";
import moduleManager from "./module/moduleManager";
import EventManager from "./events/manager";
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
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', 'https://fonts.cdnfonts.com/css/product-sans');
        document.head.appendChild(link);
            
        setInterval(() => {
            EventManager.emit("trollium.render");
            if (document.querySelector(".ErrorPopupTitleBody") && document.querySelector(".ErrorPopupTitleBody").textContent.includes("banned") && !document.querySelector(".ErrorPopupTitleBody").innerHTML.includes("Click to be unbanned.")) {
                var h1 = document.createElement("h1");
                h1.textContent = "Click to be unbanned.";
        
                document.querySelector(".ErrorPopupTitleBody").appendChild(h1);
        
                h1.addEventListener("click", function () {
                    document.cookie.split(";").forEach(function (cookie) {
                        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });
                    location.reload();
                });
            }

            if (hooks.noa?.ents.getHeldItem(hooks.noa.playerEntity)?.doAttack) {
                gameUtils.doAttack = hooks.noa.ents.getHeldItem(hooks.noa.playerEntity).doAttack.bind(hooks);
            }

        }, (1000 / 60));

        document.addEventListener("keydown", (e) => {
            EventManager.emit("trollium.keydown", e.code);
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