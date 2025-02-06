import Module from "../../module.js";
import moduleManager from "../../moduleManager.js";
import eventManager from "../../../events/manager";
import Panel from "./components/Panel.js";
import "./styles/clickgui.css";

export default class ClickGUI extends Module {
    constructor() {
        super("ClickGUI", "Mod menu of the client.", "Visual", {
            "Accent Color 1": "rgb(64, 190, 255)",
            "Accent Color 2": "rgb(129, 225, 255)",
            "Button Color": "rgb(40, 40, 40, 0.9)",
            "Hover Color": "rgb(50, 50, 50, 0.9)",
            "Header Color": "rgb(0, 0, 0, 0.85)",
            "Panel Color": "rgb(34, 34, 34, 0.85)",
            "Text Color": "#ffffff",
            "Header Text Size": "25",
            "Button Text Size": "20",
            "Setting Text Size": "15"
        }, "ShiftRight");

        this.GUILoaded = false;
        this.panels = [];
        this.blurredBackground = null;
        this.updateColors();
    }

    updateColors() {
        document.body.style.setProperty('--trollium-accent-color', 
            `linear-gradient(90deg, ${this.options["Accent Color 1"]} 0%, ${this.options["Accent Color 2"]} 100%)`);
        document.body.style.setProperty('--button-color', this.options["Button Color"]);
        document.body.style.setProperty('--hover-color', this.options["Hover Color"]);
        document.body.style.setProperty('--header-bg', this.options["Header Color"]);
        document.body.style.setProperty('--panel-bg', this.options["Panel Color"]);
        document.body.style.setProperty('--text-color', this.options["Text Color"]);
        document.body.style.setProperty('--header-text-size', this.options["Header Text Size"] + "px");
        document.body.style.setProperty('--button-text-size', this.options["Button Text Size"] + "px");
        document.body.style.setProperty('--setting-text-size', this.options["Setting Text Size"] + "px");
    }

    onEnable() {
        document.pointerLockElement && document.exitPointerLock();

        if (!this.GUILoaded) {
            this.setupBackground();
            this.createPanels();
            this.setupEventListeners();
            this.GUILoaded = true;
        } else {
            this.showGUI();
        }
    }

    setupBackground() {
        this.blurredBackground = document.createElement("div");
        this.blurredBackground.className = "gui-background";
        document.body.appendChild(this.blurredBackground);
    }

    createPanels() {
        const panelConfigs = [
            { title: "Combat", position: { top: "100px", left: "100px" } },
            { title: "Movement", position: { top: "100px", left: "320px" } },
            { title: "Visual", position: { top: "100px", left: "540px" } },
            { title: "Misc", position: { top: "100px", left: "760px" } }
        ];

        panelConfigs.forEach(config => {
            const panel = new Panel(config.title, config.position);
            this.panels.push(panel);
        });

        Object.values(moduleManager.modules).forEach(module => {
            const panel = this.panels.find(p => p.header.textContent === module.category);
            if (panel) panel.addButton(module);
        });
    }

    setupEventListeners() {
        eventManager.on("trollium.module.update", (module) => {
            const panel = this.panels.find(p => p.header.textContent === module.category);
            if (!panel) return;
            
            const button = panel.buttons.find(btn => btn.textContent === module.name);
            if (button) button.classList.toggle("enabled", module.isEnabled);
        });
    }

    showGUI() {
        this.panels.forEach(panel => panel.show());
        this.blurredBackground.style.display = "block";
        document.getElementById("root").style.opacity = "0";
    }

    onDisable() {
        this.panels.forEach(panel => panel.hide());
        this.blurredBackground.style.display = "none";
        document.getElementById("root").style.opacity = "1";
        
        const gameCanvas = document.getElementById("noa-canvas");
        if (gameCanvas) {
            gameCanvas.focus();
            gameCanvas.requestPointerLock();
        }
    }

    onSettingUpdate() {
        this.updateColors();
    }
}