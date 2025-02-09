import ModuleSettings from "./ModuleSettings.js";

export default class Panel {
    constructor(title, position = { top: "200px", left: "200px" }) {
        this.panel = document.createElement("div");
        this.panel.classList.add("gui-panel");
        this.panel.style.top = position.top;
        this.panel.style.left = position.left;
        
        this.header = document.createElement("div");
        this.header.classList.add("gui-header");
        this.header.textContent = title;
        this.panel.appendChild(this.header);
        
        this.initDrag();
        
        document.body.appendChild(this.panel);
        this.buttons = [];
    }

    initDrag() {
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.prevMouseX = 0;
        this.targetRotation = 0;
        this.currentRotation = 0;
        this.rafId = null;

        this.header.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    updateRotation = () => {
        const smoothing = 0.15;
        this.currentRotation += (this.targetRotation - this.currentRotation) * smoothing;
        this.panel.style.transform = "rotate(" + this.currentRotation.toFixed(2) + "deg)";
        if (Math.abs(this.targetRotation - this.currentRotation) > 0.01 || this.isDragging) {
            this.rafId = requestAnimationFrame(this.updateRotation);
        } else {
            this.rafId = null;
        }
    }

    handleMouseDown = (e) => {
        this.isDragging = true;
        this.dragOffsetX = e.clientX - this.panel.offsetLeft;
        this.dragOffsetY = e.clientY - this.panel.offsetTop;
        this.panel.classList.add('dragging');
        this.panel.style.transition = "none";
        this.targetRotation = 0;
        this.currentRotation = 0;
        this.prevMouseX = e.clientX;
        if (!this.rafId) this.updateRotation();
    }

    handleMouseMove = (e) => {
        if (!this.isDragging) return;
        this.panel.style.left = (e.clientX - this.dragOffsetX) + "px";
        this.panel.style.top = (e.clientY - this.dragOffsetY) + "px";
        const dx = e.clientX - this.prevMouseX;
        const intensity = this.getAnimationIntensity();
        this.targetRotation += dx * 0.2 * intensity;
        this.targetRotation = Math.max(Math.min(this.targetRotation, 5 * intensity), -5 * intensity);
        this.prevMouseX = e.clientX;
    }

    handleMouseUp = () => {
        if (this.isDragging) {
            this.isDragging = false;
            this.panel.classList.remove('dragging');
            this.targetRotation = 0;
        }
    }

    addButton(module) {
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "gui-button-container";

        const btn = document.createElement("div");
        btn.className = `gui-button ${module.isEnabled ? "enabled" : ""}`;
        btn.textContent = module.name;

        const settings = new ModuleSettings(module, buttonContainer);

        btn.addEventListener("mousedown", (event) => {
            if (event.button === 0) {
                module.toggle();
                btn.classList.toggle("enabled", module.isEnabled);
            }
            if (event.button === 1) {
                btn.textContent = "waiting for bind..";
                module.waitingForBind = true;
            }
        });

        btn.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            settings.initialize();
            settings.toggle();
        });

        btn.setAttribute("tabindex", -1);
        btn.addEventListener("keydown", (event) => {
            btn.textContent = module.name;
            if (module.waitingForBind) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                if (event.key === "Escape") {
                    module.keybind = null;
                } else {
                    module.keybind = String(event.code);
                }
                module.waitingForBind = false;
            }
        });

        buttonContainer.appendChild(btn);
        this.panel.appendChild(buttonContainer);
        this.buttons.push(btn);
        return btn;
    }

    show() {
        this.panel.style.display = "block";
    }

    hide() {
        this.panel.style.display = "none";
    }

    getAnimationIntensity() {
        return parseFloat(getComputedStyle(document.body).getPropertyValue('--animation-scale')) || 1;
    }
}
