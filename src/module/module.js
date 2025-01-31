import configManager from "../config/manager";
import eventListener from "../events/manager"

export default class Module {
    constructor(name, description, category, options, keybind) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.options = configManager.config?.modules?.[name]?.options || options;
        this.keybind = configManager.config?.modules?.[name]?.keybind || keybind;
        if (name == "ClickGUI" && !configManager.config?.modules?.[name]?.keybind) {
            this.keybind = "ShiftRight"
        }
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

    toggle () {
        this.isEnabled = !this.isEnabled;
        var names = document.querySelectorAll(".trollium-mod-name");
        names.forEach((name2) => {
            if (name2.textContent.toLowerCase() === this.name.toLowerCase()) {
                if (this.isEnabled) {
                    name2.classList.add("selected");
                } else {
                    name2.classList.remove("selected");
                }
            }
        });
    
        if (this.name !== "ClickGUI") {
            configManager.config.modules[this.name] = configManager.config.modules[this.name] || {};
        }

        eventListener.emit("trollium.module.update", this)
        
        if (this.name !== "ClickGUI") {
            configManager.config.modules[this.name].isEnabled = this.isEnabled;
        }
    
        configManager.update();

        if (this.isEnabled) {
            this.onEnable();
        } else {
            this.onDisable();
        }
    };
};