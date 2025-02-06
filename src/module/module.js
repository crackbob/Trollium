import configManager from "../config/manager";
import eventListener from "../events/manager"

export default class Module {
    constructor(name, description, category, options, keybind) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.options = options;
        this.keybind = configManager.config?.modules?.[name]?.keybind || keybind;
        this.waitingForBind = false;
        this.isEnabled = false;
        this.toggle = this.toggle.bind(this);
    }

    onEnable () {}
    onDisable() {}
    onGameTick() {}
    onRender() {}
    onEnterWorld() {}
    onExitWorld() {}
    onSettingUpdate() {}

    enable () {
        this.isEnabled = true;
        eventListener.emit("trollium.module.update", this);
        this.onEnable();
    }

    disable () {
        this.isEnabled = false;
        eventListener.emit("trollium.module.update", this);
        this.onDisable();
    }

    toggle () {
        if (this.isEnabled) {
            this.disable();
        } else {
            this.enable();
        }
    };
};