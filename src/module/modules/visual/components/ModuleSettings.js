import events from "../../../../events";

export default class ModuleSettings {
    constructor(module, container) {
        this.module = module;
        this.container = container;
        this.components = [];
        this.initialized = false;
        this.isOpen = false;
        this.settingsWrapper = null;
        this.settingsId = `module-settings-${module.name.replace(/\s+/g, '-').toLowerCase()}`;
    }

    initialize() {
        if (this.initialized || !this.module?.options) return;
        
        // Create a wrapper for the settings to improve scrolling
        this.settingsWrapper = document.createElement("div");
        this.settingsWrapper.className = "module-settings";
        this.settingsWrapper.id = this.settingsId;
        
        // Create settings container inside wrapper
        const settingsContainer = document.createElement("div");
        settingsContainer.className = "module-settings-container";
        this.settingsWrapper.appendChild(settingsContainer);
        
        // Completely remove the module title section
        // We won't create any title element at all
        
        // Create the settings elements
        Object.keys(this.module.options).forEach((key, index) => {
            const settingValue = this.module.options[key];
            const settingType = typeof settingValue;

            let component;
            if (key.toLowerCase().includes("color")) {
                component = this.addColorPicker(key, settingsContainer);
            } else if (settingType === "boolean" || settingValue === "true" || settingValue === "false") {
                component = this.addCheckbox(key, settingsContainer);
            } else if (settingType === "string") {
                component = this.addStringInput(key, settingsContainer);
            } else {
                component = this.addNumberInput(key, settingsContainer);
            }
            
            // Set animation index for staggered reveal
            if (component) {
                component.style.setProperty('--index', index);
            }
        });
        
        // Remove the separate description section that was previously at the bottom
        // and rely on the hover tooltip instead

        // Add the wrapper to the container
        this.container.appendChild(this.settingsWrapper);
        
        // Initially hide settings
        this.settingsWrapper.style.display = "none";
        this.initialized = true;
        
        // Setup ultra smooth scrolling
        this.setupUltraSmoothScrolling();
    }
    
    // Setup smooth scrolling with no scrollbar
    setupUltraSmoothScrolling() {
        if (!this.settingsWrapper) return;
        
        // Apply improved scroll properties
        this.settingsWrapper.style.overflowY = 'auto';
        this.settingsWrapper.style.scrollBehavior = 'smooth';
        this.settingsWrapper.style.scrollbarWidth = 'none'; // Firefox
        this.settingsWrapper.style.msOverflowStyle = 'none'; // IE/Edge
        
        // Smooth scrolling implementation
        let isScrolling = false;
        let startY = 0;
        let scrollTop = 0;
        let rafId = null;
        
        const startScroll = (y) => {
            isScrolling = true;
            startY = y;
            scrollTop = this.settingsWrapper.scrollTop;
            cancelAnimationFrame(rafId);
        };
        
        const moveScroll = (y) => {
            if (!isScrolling) return;
            
            const delta = startY - y;
            const targetScroll = scrollTop + delta;
            animateScroll(targetScroll);
        };
        
        const endScroll = () => {
            isScrolling = false;
        };
        
        const animateScroll = (targetPos) => {
            const currentPos = this.settingsWrapper.scrollTop;
            // Use a very smooth easing function
            const ease = 0.2;
            const newPos = currentPos + (targetPos - currentPos) * ease;
            
            this.settingsWrapper.scrollTop = newPos;
            
            // Continue animation if we're not close enough
            if (Math.abs(targetPos - newPos) > 0.5) {
                rafId = requestAnimationFrame(() => animateScroll(targetPos));
            }
        };
        
        // Improved wheel event for smoother scrolling
        this.settingsWrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            // Smooth scroll with animation frame
            const currentPos = this.settingsWrapper.scrollTop;
            const targetPos = currentPos + e.deltaY;
            
            // Use smooth animation
            animateScroll(targetPos);
        }, { passive: false });
        
        // Touch events for mobile with smoother scrolling
        this.settingsWrapper.addEventListener('touchstart', (e) => {
            startScroll(e.touches[0].clientY);
        }, { passive: true });
        
        this.settingsWrapper.addEventListener('touchmove', (e) => {
            moveScroll(e.touches[0].clientY);
            e.preventDefault();
        }, { passive: false });
        
        this.settingsWrapper.addEventListener('touchend', () => {
            endScroll();
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            // Show settings with clean animation
            this.settingsWrapper.style.display = "block";
            this.settingsWrapper.classList.add("module-settings-enter");
            this.settingsWrapper.classList.remove("module-settings-exit");
            
            // No flashing or additional animations for the containers
            // Don't add any animate-in classes to the child elements
            
            // Add margin to button container
            this.container.style.marginBottom = "5px";
        } else {
            // Hide settings with clean animation
            this.settingsWrapper.classList.remove("module-settings-enter");
            this.settingsWrapper.classList.add("module-settings-exit");
            
            // Remove margin from button container
            this.container.style.marginBottom = "0px";
            
            // Hide the element after animation completes
            setTimeout(() => {
                this.settingsWrapper.style.display = "none";
            }, 200);
        }
    }

    addNumberInput(name, parent) {
        const container = document.createElement("div");
        container.className = "gui-setting-container";

        const label = document.createElement("span");
        label.className = "gui-setting-label";
        label.textContent = name;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "gui-text-input";
        input.value = this.module.options[name];

        let lastValidValue = input.value;

        input.addEventListener("input", () => {
            const value = input.value.trim();
            if (!isNaN(value) && value !== "") {
                lastValidValue = value;
                this.module.options[name] = value;
                events.emit("setting.update", this.module);
                
                // Add input animation
                input.classList.add("value-changed");
                setTimeout(() => input.classList.remove("value-changed"), 500);
            }
        });

        input.addEventListener("blur", () => {
            if (isNaN(input.value) || input.value.trim() === "") {
                input.classList.add("invalid");
                setTimeout(() => {
                    input.classList.remove("invalid");
                    input.value = lastValidValue;
                }, 300);
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                input.blur();
            }
        });

        container.appendChild(label);
        container.appendChild(input);
        parent.appendChild(container);
        this.components.push(container);
        
        return container;
    }

    addStringInput(name, parent) {
        const container = document.createElement("div");
        container.className = "gui-setting-container";

        const label = document.createElement("span");
        label.className = "gui-setting-label";
        label.textContent = name;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "gui-text-input";
        input.value = this.module.options[name];

        input.addEventListener("input", () => {
            const value = input.value.trim();
            this.module.options[name] = value;
            events.emit("setting.update", this.module);
            
            // Add input animation
            input.classList.add("value-changed");
            setTimeout(() => input.classList.remove("value-changed"), 500);
        });

        container.appendChild(label);
        container.appendChild(input);
        parent.appendChild(container);
        this.components.push(container);
        
        return container;
    }

    addCheckbox(name, parent) {
        const container = document.createElement("div");
        container.className = "gui-setting-container";

        const label = document.createElement("span");
        label.className = "gui-setting-label";
        label.textContent = name;

        const checkbox = document.createElement("div");
        checkbox.className = "gui-checkbox";
        checkbox.classList.toggle("enabled", this.module.options[name] === true || this.module.options[name] === "true");

        checkbox.addEventListener("click", () => {
            const wasChecked = checkbox.classList.contains("enabled");
            checkbox.classList.toggle("enabled");
            this.module.options[name] = (!wasChecked).toString();
            events.emit("setting.update", this.module);
            
            // Add checkbox animation
            checkbox.classList.add("clicked");
            setTimeout(() => checkbox.classList.remove("clicked"), 500);
        });

        container.appendChild(label);
        container.appendChild(checkbox);
        parent.appendChild(container);
        this.components.push(container);
        
        return container;
    }

    addColorPicker(name, parent) {
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
        
        // Convert RGB to HEX for color input
        if (this.module.options[name].startsWith('rgb')) {
            colorPicker.value = this.rgbToHex(this.module.options[name]);
        } else {
            colorPicker.value = this.module.options[name];
        }
        
        colorPickerBg.appendChild(colorPicker);

        colorPicker.addEventListener("input", (event) => {
            colorPickerBg.style.background = event.target.value;
            this.module.options[name] = event.target.value;
            events.emit("setting.update", this.module);
            
            // Add color animation
            colorPickerBg.classList.add("color-changed");
            setTimeout(() => colorPickerBg.classList.remove("color-changed"), 500);
        });

        container.appendChild(label);
        container.appendChild(colorPickerBg);
        parent.appendChild(container);
        this.components.push(container);
        
        return container;
    }
    
    // Utility function to convert RGB to HEX
    rgbToHex(rgbStr) {
        try {
            // Extract R, G, B values from string like "rgb(64, 190, 255)"
            const rgb = rgbStr.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/i);
            if (!rgb) return "#40BEFF"; // Default fallback if format doesn't match
            
            // Convert each component to hex
            const r = parseInt(rgb[1], 10).toString(16).padStart(2, '0');
            const g = parseInt(rgb[2], 10).toString(16).padStart(2, '0');
            const b = parseInt(rgb[3], 10).toString(16).padStart(2, '0');
            
            return `#${r}${g}${b}`;
        } catch (e) {
            console.error("RGB to HEX conversion error:", e);
            return "#40BEFF"; // Fallback on error
        }
    }
}
