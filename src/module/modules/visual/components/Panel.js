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
        
        // Add animation state properties
        this.isAnimating = false;
        this.animationStartTime = 0;
        this.initialTransform = '';
        this.targetTransform = '';
    }

    initDrag() {
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.prevMouseX = 0;
        this.targetRotation = 0;
        this.currentRotation = 0;
        this.rafId = null;
        this.dragVelocity = { x: 0, y: 0 };
        this.lastDragPosition = { x: 0, y: 0 };
        this.lastDragTime = 0;

        this.header.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    updateRotation = () => {
        const smoothing = 0.15;
        this.currentRotation += (this.targetRotation - this.currentRotation) * smoothing;
        
        // Apply 3D transform for a more realistic effect
        this.panel.style.transform = `
            rotate(${this.currentRotation.toFixed(2)}deg) 
            perspective(1200px)
            rotateX(${this.currentRotation * 0.2}deg)
        `;
        
        if (Math.abs(this.targetRotation - this.currentRotation) > 0.01 || this.isDragging) {
            this.rafId = requestAnimationFrame(this.updateRotation);
        } else {
            this.currentRotation = 0;
            this.panel.style.transform = `
                rotate(0deg) 
                perspective(1200px)
                rotateX(0deg)
            `;
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
        
        // Record starting position and time for velocity
        this.lastDragPosition = { x: e.clientX, y: e.clientY };
        this.lastDragTime = performance.now();
        
        if (!this.rafId) this.updateRotation();
        
        // Bring panel to front
        const highestZIndex = this.getHighestZIndex();
        if (parseInt(getComputedStyle(this.panel).zIndex) < highestZIndex) {
            this.panel.style.zIndex = (highestZIndex + 1).toString();
        }
    }

    handleMouseMove = (e) => {
        if (!this.isDragging) return;
        
        // Calculate new position
        const newLeft = e.clientX - this.dragOffsetX;
        const newTop = e.clientY - this.dragOffsetY;
        
        // Apply with smooth physics
        this.applyDragPhysics(newLeft, newTop);
        
        // Calculate rotation based on horizontal movement
        const dx = e.clientX - this.prevMouseX;
        const intensity = this.getAnimationIntensity();
        this.targetRotation += dx * 0.2 * intensity;
        this.targetRotation = Math.max(Math.min(this.targetRotation, 5 * intensity), -5 * intensity);
        this.prevMouseX = e.clientX;
        
        // Calculate velocity
        const now = performance.now();
        const elapsed = now - this.lastDragTime;
        
        if (elapsed > 0) {
            this.dragVelocity = {
                x: (e.clientX - this.lastDragPosition.x) / elapsed,
                y: (e.clientY - this.lastDragPosition.y) / elapsed
            };
            
            this.lastDragPosition = { x: e.clientX, y: e.clientY };
            this.lastDragTime = now;
        }
    }
    
    applyDragPhysics(newLeft, newTop) {
        // Get viewport boundaries with padding
        const padding = 10;
        const maxLeft = window.innerWidth - this.panel.offsetWidth - padding;
        const maxTop = window.innerHeight - this.panel.offsetHeight - padding;
        
        // Apply boundaries with bouncy effect
        let finalLeft = Math.max(padding, Math.min(newLeft, maxLeft));
        let finalTop = Math.max(padding, Math.min(newTop, maxTop));
        
        // Apply position
        this.panel.style.left = finalLeft + "px";
        this.panel.style.top = finalTop + "px";
    }

    handleMouseUp = () => {
        if (this.isDragging) {
            this.isDragging = false;
            this.panel.classList.remove('dragging');
            this.targetRotation = 0;
            
            // Apply inertia effect
            this.applyDragInertia();
        }
    }
    
    applyDragInertia() {
        // Apply inertia effect when dragging stops
        if (Math.abs(this.dragVelocity.x) > 0.1 || Math.abs(this.dragVelocity.y) > 0.1) {
            const friction = 0.95;
            const initialVelocity = { ...this.dragVelocity };
            const initialPosition = { 
                x: parseFloat(this.panel.style.left), 
                y: parseFloat(this.panel.style.top) 
            };
            
            // Get viewport boundaries
            const padding = 10;
            const maxLeft = window.innerWidth - this.panel.offsetWidth - padding;
            const maxTop = window.innerHeight - this.panel.offsetHeight - padding;
            
            let currentVelocity = { ...initialVelocity };
            let frame = 0;
            
            const applyInertia = () => {
                // Reduce velocity with friction
                currentVelocity.x *= friction;
                currentVelocity.y *= friction;
                
                // Calculate new position
                let newLeft = initialPosition.x + (currentVelocity.x * 16 * frame);
                let newTop = initialPosition.y + (currentVelocity.y * 16 * frame);
                
                // Apply boundaries
                newLeft = Math.max(padding, Math.min(newLeft, maxLeft));
                newTop = Math.max(padding, Math.min(newTop, maxTop));
                
                // Apply position with smooth easing
                this.panel.style.transition = "transform 0.05s linear, left 0.2s cubic-bezier(0.2, 0.9, 0.4, 1), top 0.2s cubic-bezier(0.2, 0.9, 0.4, 1)";
                this.panel.style.left = newLeft + "px";
                this.panel.style.top = newTop + "px";
                
                frame++;
                
                // Continue inertia if velocity is significant
                if (Math.abs(currentVelocity.x) > 0.1 || Math.abs(currentVelocity.y) > 0.1) {
                    requestAnimationFrame(applyInertia);
                } else {
                    // Reset transition when inertia stops
                    setTimeout(() => {
                        this.panel.style.transition = "";
                    }, 200);
                }
            };
            
            requestAnimationFrame(applyInertia);
        }
    }
    
    getHighestZIndex() {
        const panels = document.querySelectorAll('.gui-panel');
        let highest = 1000; // base z-index for panels
        
        panels.forEach(panel => {
            const zIndex = parseInt(getComputedStyle(panel).zIndex);
            if (!isNaN(zIndex) && zIndex > highest) {
                highest = zIndex;
            }
        });
        
        return highest;
    }

    addButton(module) {
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "gui-button-container";

        const btn = document.createElement("div");
        btn.className = `gui-button ${module.isEnabled ? "enabled" : ""}`;
        btn.textContent = module.name;
        
        // Add focus/interactive effects
        btn.tabIndex = 0; // Make focusable

        // Mark visual modules for special handling
        if (module.category === "Visual") {
            btn.setAttribute("data-visual-module", "true");
        }

        const settings = new ModuleSettings(module, buttonContainer);

        btn.addEventListener("mousedown", (event) => {
            if (event.button === 0) {
                // Add press effect
                btn.classList.add("pressed");
                
                // Toggle module state
                module.toggle();
                btn.classList.toggle("enabled", module.isEnabled);
                
                // Remove press effect after a short delay
                setTimeout(() => {
                    btn.classList.remove("pressed");
                }, 150);
            }
            if (event.button === 1) {
                btn.textContent = "waiting for bind..";
                module.waitingForBind = true;
            }
        });

        btn.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            
            // Initialize settings if not already done
            if (!settings.initialized) {
                settings.initialize();
            }
            
            // Add contextmenu animation
            btn.classList.add("context-clicked");
            setTimeout(() => btn.classList.remove("context-clicked"), 300);
            
            // Toggle settings panel
            settings.toggle();
            
            // Add special class to settings container for animation
            const settingsContainers = buttonContainer.querySelectorAll('.gui-setting-container');
            settingsContainers.forEach((container, index) => {
                container.style.setProperty('--index', index);
            });
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
        this.panel.style.opacity = "1";
    }

    hide() {
        this.panel.style.display = "none";
        this.panel.style.opacity = "0";
    }
    
    animateIn() {
        // No animations - panel is already visible from show()
    }
    
    animateOut() {
        // No animations - panel is already hidden from hide()
    }

    getAnimationIntensity() {
        return parseFloat(getComputedStyle(document.body).getPropertyValue('--animation-scale')) || 1;
    }
}
