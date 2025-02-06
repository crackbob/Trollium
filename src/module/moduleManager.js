import eventManager from "../events/manager";
import ArrayList from "./modules/visual/Arraylist";
import BottomChat from "./modules/visual/UITweaks";
import gameUtils from "../utils/gameUtils";
import configManager from "../config/manager";

import ESP from "./modules/visual/ESP";
import ViewModel from "./modules/visual/viewModel";
import Wireframe from "./modules/visual/Wireframe";
import Watermark from "./modules/visual/Watermark";
import AutoSprint from "./modules/movement/autoSprint";
import Bhop from "./modules/movement/Bhop";
import BoatFly from "./modules/movement/boatFly";
import FireballFly from "./modules/movement/FireballFly";
import HighJump from "./modules/movement/highJump";
import NoClip from "./modules/movement/NoClip";
import SafeWalk from "./modules/movement/Safewalk";
import Scaffold from "./modules/movement/Scaffold";
import Spider from "./modules/movement/Spider";
import Blink from "./modules/misc/Blink";
import FastBreak from "./modules/misc/FastBreak";
import Killsults from "./modules/misc/Killsults";
import Aimbot from "./modules/combat/Aimbot";
import AntiRecoil from "./modules/combat/AntiRecoil";
import Killaura from "./modules/combat/Killaura";
import TargetStrafe from "./modules/combat/TargetStrafe";
import Velocity from "./modules/movement/Velocity";
import ClickGUI from "./modules/visual/ClickGUI";
import FastCrouch from "./modules/movement/FastCrouch";
import UITweaks from "./modules/visual/UITweaks";
import Derp from "./modules/misc/Derp";
import ItemReach from "./modules/misc/ItemReach";
import Jesus from "./modules/movement/Jesus";
import MagicBullet from "./modules/combat/MagicBullet";
import BedAura from "./modules/misc/BedAura";
import Freeze from "./modules/movement/Freeze";
import Fill from "./modules/misc/Fill";
import AntiSpike from "./modules/movement/AntiSpike";

export default {
    modules: {},
    addModule: function (module) {
        this.modules[module.name] = module;
    },
    handleKeyPress: function (key) {
        for (let name in this.modules) {
            let module = this.modules[name];

            if (module.waitingForBind) {
                module.keybind = key;
                module.waitingForBind = false;

                if (!configManager.config.modules[name]) {
                    configManager.config.modules[name] = {};
                }

                configManager.config.modules[name].keybind = key;
                
            } else if (module.keybind == key) {
                module.toggle();
            }
        }
    },

    get (name) {
        for (let i = 0; i < this.modules.length; i++) {
            if (this.modules[i].name === name) {
                return this.modules[i];
            }
        }
        return null;
    },

    init () {
        this.addModule(new ArrayList());
        this.addModule(new BottomChat());
        this.addModule(new ESP());
        this.addModule(new UITweaks());
        this.addModule(new ViewModel());
        this.addModule(new Watermark());
        this.addModule(new Wireframe());
        this.addModule(new AutoSprint());
        this.addModule(new Bhop());
        this.addModule(new BoatFly());
        this.addModule(new FireballFly());
        this.addModule(new HighJump());
        this.addModule(new NoClip());
        this.addModule(new SafeWalk());
        this.addModule(new Scaffold());
        this.addModule(new Spider());
        this.addModule(new Velocity());
        this.addModule(new Blink());
        this.addModule(new FastBreak());
        this.addModule(new Killsults());
        this.addModule(new Aimbot());
        this.addModule(new AntiRecoil());
        this.addModule(new Killaura());
        this.addModule(new TargetStrafe());
        this.addModule(new ClickGUI());
        this.addModule(new ItemReach());
        this.addModule(new FastCrouch());
        this.addModule(new Derp());
        this.addModule(new Jesus());
        this.addModule(new MagicBullet());
        this.addModule(new BedAura());
        this.addModule(new Freeze());
        this.addModule(new Fill());
        this.addModule(new AntiSpike());

        let lastTickTime = 0;
        eventManager.on("gameTick", () => {
            lastTickTime = Date.now();
            let joinedWorld = false;
            if (gameUtils.inGame == false) {
                gameUtils.inGame = true;
                joinedWorld = true;
            }

            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onGameTick();

                    if (joinedWorld) {
                        this.modules[name].onEnterWorld();
                    }
                }
            }
        });
        eventManager.on("trollium.render", () => {
            const now = Date.now();
            let leftWorld = false;
            if (now - lastTickTime > 2500 && gameUtils.inGame) {
                gameUtils.inGame = false;
                leftWorld = true;
            }
            
            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onRender();

                    if (leftWorld) {
                        this.modules[name].onExitWorld();
                    }
                }
            }
        });

        eventManager.on("trollium.keydown", this.handleKeyPress.bind(this));
        eventManager.on("trollium.setting.update", () => {
            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onSettingUpdate();
                }
            }
        });
    }
};