import eventManager from "../../../../events/manager";

export default class ModuleSettings {
    constructor(module, container) {
        this.module = module;
        this.container = container;
        this.components = [];
        this.initialized = false;
        this.isOpen = false;
    }

    initialize() {
        if (this.initialized) return;
        
        Object.keys(this.module.options).forEach(key => {
            const settingValue = this.module.options[key];
            const settingType = typeof settingValue;

            if (key.toLowerCase().includes("color")) {
                this.addColorPicker(key);
            } else if (settingType === "boolean") {
                this.addCheckbox(key);
            }
        });

        this.components.forEach(component => component.style.display = "none");
        this.initialized = true;
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.components.forEach(component => {
            component.style.display = this.isOpen ? "flex" : "none";
        });
    }

    addCheckbox(name) {
        const container = document.createElement("div");
        container.className = "gui-setting-container";

        const label = document.createElement("span");
        label.className = "gui-setting-label";
        label.textContent = name;

        const checkbox = document.createElement("div");
        checkbox.className = "gui-checkbox";
        checkbox.classList.toggle("enabled", this.module.options[name]);

        checkbox.addEventListener("click", () => {
            const wasChecked = checkbox.classList.contains("enabled");
            checkbox.classList.toggle("enabled");
            this.module.options[name] = !wasChecked;
            eventManager.emit("trollium.setting.update", this.module);
        });

        container.appendChild(label);
        container.appendChild(checkbox);
        this.container.appendChild(container);
        this.components.push(container);
    }

    addColorPicker(name) {
        const container = document.createElement("div");
        container.className = "gui-setting-container";

        const label = document.createElement("span");
        label.className = "gui-setting-label";
        label.textContent = name;

        const colorPickerBg = document.createElement("div");
        colorPickerBg.className = "gui-color-picker";
        colorPickerBg.style.background = this.module.options[name];

        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.className = "gui-color-input";
        colorPickerBg.appendChild(colorPicker);

        colorPicker.addEventListener("input", (event) => {
            colorPickerBg.style.background = event.target.value;
            this.module.options[name] = event.target.value;
            eventManager.emit("trollium.setting.update", this.module);
        });

        container.appendChild(label);
        container.appendChild(colorPickerBg);
        this.container.appendChild(container);
        this.components.push(container);
    }
}
