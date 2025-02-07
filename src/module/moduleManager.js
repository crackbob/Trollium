import events from "../events";
import ArrayList from "./modules/visual/Arraylist";
import BottomChat from "./modules/visual/UITweaks";
import gameUtils from "../utils/gameUtils";
import configManager from "../config/manager";
import hooks from "../hooks";

import ESP from "./modules/visual/ESP";
import ViewModel from "./modules/visual/ViewModel";
import Wireframe from "./modules/visual/Wireframe";
import Watermark from "./modules/visual/Watermark";
import AutoSprint from "./modules/movement/AutoSprint";
import Bhop from "./modules/movement/Bhop";
import BoatFly from "./modules/movement/BoatFly";
import FireballFly from "./modules/movement/FireballFly";
import HighJump from "./modules/movement/HighJump";
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
import UITweaks from "./modules/visual/UITweaks";
import Derp from "./modules/misc/Derp";
import ItemReach from "./modules/misc/ItemReach";
import Jesus from "./modules/movement/Jesus";
import MagicBullet from "./modules/combat/MagicBullet";
import BedAura from "./modules/misc/BedAura";
import Freeze from "./modules/movement/Freeze";
import Fill from "./modules/misc/Fill";
import AntiSpike from "./modules/movement/AntiSpike";
import AntiBan from "./modules/misc/AntiBan";
import NoSlow from "./modules/movement/NoSlow";
import IdentityCrisis from "./modules/misc/IdentityCrisis";
import Twerk from "./modules/movement/Twerk";
import Speed from "./modules/movement/Speed";

export default {
    modules: {},
    addModules: function (...modules) {
        for(const module of modules) this.modules[module.name] = module;
    },
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

    init () {
        this.addModules(
            new ArrayList(),
            new BottomChat(),
            new ESP(),
            new UITweaks(),
            new ViewModel(),
            new Watermark(),
            new Wireframe(),
            new AutoSprint(),
            new Bhop(),
            new BoatFly(),
            new FireballFly(),
            new HighJump(),
            new NoClip(),
            new SafeWalk(),
            new Scaffold(),
            new Spider(),
            new Velocity(),
            new Blink(),
            new FastBreak(),
            new Killsults(),
            new Aimbot(),
            new AntiRecoil(),
            new Killaura(),
            new TargetStrafe(),
            new ClickGUI(),
            new ItemReach(),
            new Derp(),
            new Jesus(),
            new MagicBullet(),
            new BedAura(),
            new Freeze(),
            new Fill(),
            new AntiSpike(),
            new AntiBan(),
            new NoSlow(),
            new IdentityCrisis(),
            new Twerk(),
            new Speed()
        );

        events.on("gameTick", () => {
            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onGameTick();
                }
            }
        });
        
        hooks.bloxdEvents.subscribe("onGameEntered", function(data) {
            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onGameEntered();
                }
            }
        });

        hooks.bloxdEvents.subscribe("onGameExited", function(data) {
            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onGameExited();
                }
            }
        });

        events.on("render", () => {
            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onRender();
                }
            }
        });

        events.on("keydown", this.handleKeyPress.bind(this));
        events.on("setting.update", () => {
            for (let name in this.modules) {
                if (this.modules[name].isEnabled) {
                    this.modules[name].onSettingUpdate();
                }
            }
        });

        
        this.modules["Arraylist"].enable();
        this.modules["Watermark"].enable();
        this.modules["AntiBan"].enable();
    }
};