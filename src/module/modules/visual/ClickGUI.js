import Module from "../../Module.js";
import moduleManager from "../../moduleManager.js";
import ConfigManager from "../../../config/manager.js";
import eventManager from "../../../events/manager";

export default class ClickGUI extends Module {
    constructor() {
        super("ClickGUI", "Mod menu of the client.", "Visual", null);

        this.GUILoaded = false;
        this.panels = [];
        this.blurredBackground = null;
        this.buttonColor = "rgb(40, 40, 40, 0.9)";
        this.accentColor = "var(--trollium-accent-color)";
        this.secondAccentColor = "aqua"; 
        this.hoverColor = "rgb(50, 50, 50, 0.9)";

        this.options = {
            "Accent Color 1": "rgb(64, 190, 255)",
            "Accent Color 2": "rgb(129, 225, 255)"
        }

        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', 'https://fonts.cdnfonts.com/css/product-sans');
        document.head.appendChild(link);
    }

    onEnable() {
        var _this = this;
        document.pointerLockElement && document.exitPointerLock();

        if (!this.GUILoaded) {

            this.blurredBackground = document.createElement("div");
            this.blurredBackground.style.backdropFilter = "blur(15px)";
            this.blurredBackground.style.position = "absolute";
            this.blurredBackground.style.left = "0";
            this.blurredBackground.style.top = "0";
            this.blurredBackground.style.zIndex = "99999";
            this.blurredBackground.style.height = "100%";
            this.blurredBackground.style.width = "100%";
            document.body.appendChild(this.blurredBackground);

            const combatTab = this.createPanel("Combat", { top: "100px", left: "100px" });
            const movementTab = this.createPanel("Movement", { top: "100px", left: "320px" });
            const visualTab = this.createPanel("Visual", { top: "100px", left: "540px" });
            const miscTab = this.createPanel("Misc", { top: "100px", left: "760px" });

            Object.values(moduleManager.modules).forEach(module => {
                switch (module.category) {
                    case 'Combat':
                        combatTab.addButton(module);
                        break;
                    case 'Movement':
                        movementTab.addButton(module);
                        break;
                    case 'Visual':
                        visualTab.addButton(module);
                        break;
                    case 'Misc':
                        miscTab.addButton(module);
                        break;
                }
            })

            eventManager.on("trollium.module.update", (module) => {
                let panel = this.panels.find(panel => panel.panelTitle == module.category);
                let button = panel.buttons.find(button => button.textContent == module.name);

                if (module.isEnabled) {
                    button.style.background = this.accentColor;
                } else {
                    button.style.background = this.buttonColor;
                }
            })

            this.GUILoaded = true;
        } else {
            this.panels.forEach(panel => panel.panel.style.display = "block");
            this.blurredBackground.style.display = "block";
            document.getElementById("root").style.opacity = "0";
        }
    }

    onDisable() {
        this.panels.forEach(panel => panel.panel.style.display = "none");
        this.blurredBackground.style.display = "none";
        let gameCanvas = document.getElementById("noa-canvas");
        document.getElementById("root").style.opacity = "1";
        if (gameCanvas) {
            gameCanvas.focus();
            gameCanvas.requestPointerLock();
        }
    }

    onSettingUpdate() {
        document.body.style.setProperty('--trollium-accent-color', `linear-gradient(90deg, ${this.options["Accent Color 1"]} 0%, ${this.options["Accent Color 2"]} 100%)`)
    }

    createPanel(panelTitle, panelPosition = { top: "200px", left: "200px" }) {
        const panel = document.createElement("div");
        panel.style.position = 'fixed';
        panel.style.zIndex = "9999";
        panel.style.top = panelPosition.top;
        panel.style.left = panelPosition.left;
        panel.style.width = "200px";
        panel.style.borderRadius = "8px";
        panel.style.backgroundColor = "rgb(34, 34, 34, 0.85)";
        panel.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
        panel.style.fontFamily = "'Product Sans', sans-serif";
        panel.style.color = "#fff";
        panel.style.overflow = 'hidden';
        panel.style.zIndex = "999999";
    
        const header = document.createElement("div");
        header.style.backgroundColor = "rgb(10, 10, 10, 0.85)";
        header.style.height = "40px";
        header.style.fontWeight = "900";
        header.style.display = "flex";
        header.style.alignItems = "center";
        header.style.justifyContent = "center";
        header.style.fontSize = "25px";
        header.textContent = panelTitle;
        panel.appendChild(header);
    
        document.body.appendChild(panel);
     
        const buttons = [];
        const buttonHeight = 35;
        const buttonColor = "rgb(40, 40, 40, 0.9)";
        const accentColor = "var(--trollium-accent-color)";
        const secondAccentColor = "aqua"; 
        const hoverColor = "rgb(50, 50, 50, 0.9)"; 
    
        let isDragging = false;
        let offset = { x: 0, y: 0 };
    
        function addButton(module) {
            const buttonContainer = document.createElement("div");
            buttonContainer.style.backgroundColor = "rgb(10, 10, 10, 0.85)";
            buttonContainer.style.display = "flex";
            buttonContainer.style.flexDirection = "column";
    
            const btn = document.createElement("div");
            btn.className = "button";
            btn.style.height = `${buttonHeight}px`;
            btn.style.display = "flex";
            btn.style.alignItems = "center";
            btn.style.paddingLeft = "10px";
            btn.style.boxSizing = "border-box";
            btn.style.cursor = "pointer";
            btn.style.borderRadius = "0";
            btn.style.transition = "all 0.3s";
            btn.style.fontSize = "20px";
            btn.style.fontWeight = "200";
            btn.style.outline = "none";
    
            btn.textContent = module.name;

            if (module.isEnabled) {
                btn.style.background = accentColor;
            } else {
                btn.style.background = buttonColor;
            }
    
            btn.addEventListener("mouseenter", () => {
                if (module.isEnabled) return;
                btn.style.background = hoverColor;
            });
    
            btn.addEventListener("mouseleave", () => {
                if (module.isEnabled) return;
                btn.style.background = buttonColor;
            });

            btn.addEventListener("mousedown", function (event) {
                if (event.button == 0) {
                    btn.style.background = accentColor;
                    module.toggle();
                }
                if (event.button == 1) {
                    btn.textContent = "waiting for bind..";
                    module.waitingForBind = true;
                }
            });

            btn.setAttribute("tabindex", -1)
            btn.addEventListener("keydown", function (event) {
                btn.textContent = module.name;
                if (module.waitingForBind) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    if (event.key === "Escape") {
                        module.keybind = "";
                        module.waitingForBind = false;
                    } else {
                        module.keybind = String(event.code);
                        module.waitingForBind = false;
                    }

                    ConfigManager.config.modules[module.name].keybind = module.keybind;
                    ConfigManager.update();
                }
            });

            buttonContainer.appendChild(btn);
            buttons.push(btn);
            panel.appendChild(buttonContainer);

            let settingComponents = [];
            function addCheckbox (name, module) {
                const checkboxContainer = document.createElement("div");
                checkboxContainer.style.display = "flex";
                checkboxContainer.style.alignItems = "center";
                checkboxContainer.style.margin = "2px";
                checkboxContainer.style.justifyContent = "space-between";
                
                const checkboxLabel = document.createElement("span");
                checkboxLabel.style.fontSize = "15px";
                checkboxLabel.style.marginLeft = "10px";
                checkboxLabel.style.fontWeight = "300";
                checkboxLabel.textContent = name;
        
                const checkbox = document.createElement("div");
                checkbox.style.width = "15px";
                checkbox.style.height = "15px";
                checkbox.style.borderRadius = "4px";
                checkbox.style.background = buttonColor;
                checkbox.style.position = "relative";
                checkbox.style.margin = "8px";
                checkbox.style.cursor = "pointer";
        
                checkbox.addEventListener("click", () => {
                    const wasChecked = checkbox.style.background == accentColor;
                    checkbox.style.background = wasChecked ? buttonColor : accentColor;
                    eventManager.emit("trollium.setting.update", module)
                    module.options[name] = !wasChecked;
                });
        
                checkboxContainer.appendChild(checkboxLabel);
                checkboxContainer.appendChild(checkbox);
                buttonContainer.appendChild(checkboxContainer);
                settingComponents.push(checkboxContainer);
            }

            function addColorPicker (name, module) {
                const colorPickerContainer = document.createElement("div");
                colorPickerContainer.style.display = "flex";
                colorPickerContainer.style.alignItems = "center";
                colorPickerContainer.style.margin = "2px"; 
                colorPickerContainer.style.justifyContent = "space-between";
                
                const colorPickerLabel = document.createElement("span");
                colorPickerLabel.style.fontSize = "15px";
                colorPickerLabel.style.marginLeft = "10px";
                colorPickerLabel.style.fontWeight = "300";
                colorPickerLabel.textContent = name;
        
                const colorPickerBg = document.createElement("div");
                colorPickerBg.style.width = "15px";
                colorPickerBg.style.height = "15px";
                colorPickerBg.style.borderRadius = "4px";
                colorPickerBg.style.background = module.options[name];
                colorPickerBg.style.position = "relative";
                colorPickerBg.style.margin = "8px";
                colorPickerBg.style.cursor = "pointer";

                const colorPicker = document.createElement("input");
                colorPicker.type = "color";
                colorPicker.style.width = "20px";
                colorPicker.style.height = "20px";
                colorPicker.style.opacity = "0";
                colorPickerBg.append(colorPicker);
        
                colorPicker.addEventListener("input", (event) => {
                    colorPickerBg.style.background = event.target.value;
                    eventManager.emit("trollium.setting.update", module)
                    module.options[name] = event.target.value;
                });
        
                colorPickerContainer.appendChild(colorPickerLabel);
                colorPickerContainer.appendChild(colorPickerBg);
                buttonContainer.appendChild(colorPickerContainer);
                settingComponents.push(colorPickerContainer);
            }

            let settingsInitialized = false;
            let settingsOpen = false;
            btn.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                settingsOpen = !settingsOpen;

                if (settingsOpen) {
                    settingComponents.forEach(component => component.style.display = "flex");
                } else {
                    settingComponents.forEach(component => component.style.display = "none");
                }

                if (!settingsInitialized) {
                    Object.keys(module.options).forEach((key) => {

                        let container = document.createElement("div");
                        container.className = "trollium-toggle-container";

                        let settingValue = module.options[key];
                        let settingType = typeof settingValue;
                        
                        if (key.toLowerCase().includes("color")) {
                            addColorPicker(key, module);
                        }

                        if (settingType == "boolean") {
                            addCheckbox(key, module);
                        }
                    });
                    settingsInitialized = true;
                }
            });
        }
    
        header.addEventListener('mousedown', (event) => {
            isDragging = true;
            offset.x = event.clientX - panel.getBoundingClientRect().left;
            offset.y = event.clientY - panel.getBoundingClientRect().top;
            header.style.cursor = 'grabbing';
        });
    
        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                panel.style.left = `${event.clientX - offset.x}px`;
                panel.style.top = `${event.clientY - offset.y}px`;
            }
        });
    
        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'grab';
        });

        let retVal = { addButton, panel, buttons, panelTitle };
        this.panels.push(retVal);
        return retVal;
    }
};