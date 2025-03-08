import Module from "../../module.js";
import moduleManager from "../../moduleManager.js";
import events from "../../../events";
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
            "Panel Color": "rgb(18 18 18)",
            "Text Color": "#ffffff",
            "Enable Animations": true,
            "Animation Intensity": 1,
            "Scrolling Smoothness": 0.8,
            "Use Spring Physics": true,
            "Panel Open Effect": "slide-in" // Options: slide-in, fade-in, scale-in
        }, "ShiftRight");

        this.GUILoaded = false;
        this.panels = [];
        this.blurredBackground = null;
        this.searchContainer = null;
        this.searchResults = null;
        this.searchInput = null;
        this.allModules = [];
        this.isAnimatingOpen = false;
        this.searchResultModules = [];
        this.updateColors();
        this.scrollObservers = [];
        this.moduleSettingIds = new Map();
        this.nextSettingId = 1;
    }

    updateAnimations() {
        if (this.options["Enable Animations"]) {
            document.body.classList.add("with-animations");
            
            // Update animation variables
            document.body.style.setProperty('--animation-scale', this.options["Animation Intensity"]);
            
            // Update easing based on whether spring physics is enabled
            if (this.options["Use Spring Physics"]) {
                document.body.style.setProperty('--spring-easing', 'cubic-bezier(0.34, 1.56, 0.64, 1)');
            } else {
                document.body.style.setProperty('--spring-easing', 'cubic-bezier(0.4, 0, 0.2, 1)');
            }
            
            // Update scrolling smoothness
            const scrollSmoothness = this.options["Scrolling Smoothness"];
            document.body.style.setProperty('--scroll-behavior', `${scrollSmoothness * 1000}ms`);
        } else {
            document.body.classList.remove("with-animations");
        }
    }

    updateColors() {
        document.body.style.setProperty('--trollium-accent-color', 
            `linear-gradient(90deg, ${this.options["Accent Color 1"]} 0%, ${this.options["Accent Color 2"]} 100%)`);
        document.body.style.setProperty('--button-color', this.options["Button Color"]);
        document.body.style.setProperty('--hover-color', this.options["Hover Color"]);
        document.body.style.setProperty('--header-bg', this.options["Header Color"]);
        document.body.style.setProperty('--panel-bg', this.options["Panel Color"]);
        document.body.style.setProperty('--text-color', this.options["Text Color"]);
        document.body.style.setProperty('--glow-color', this.options["Accent Color 1"].replace(')', ', 0.4)').replace('rgb', 'rgba'));
    }

    onEnable() {
        document.pointerLockElement && document.exitPointerLock();

        if (!this.GUILoaded) {
            this.setupBackground();
            this.createSearchBar();
            this.createPanels();
            this.setupEventListeners();
            this.setupScrollAnimations();
            this.GUILoaded = true;
            this.updateAnimations();
            
            // Initialize IntersectionObserver for scroll animations
            this.setupIntersectionObservers();
        } else {
            this.showGUI();
            this.updateAnimations();
        }
        
        // Start the opening animation sequence
        this.animateOpeningSequence();
    }
    
    animateOpeningSequence() {
        this.isAnimatingOpen = true;
        
        // Show background immediately
        this.blurredBackground.style.display = 'block';
        this.blurredBackground.style.backdropFilter = 'blur(8px)';
        this.blurredBackground.style.background = 'rgba(0, 0, 0, 0.4)';
        
        // Show panels immediately
        this.panels.forEach(panel => {
            panel.show();
        });
        
        // Show search immediately
        this.searchContainer.style.display = 'block';
        
        // Focus the search
        this.searchInput.focus();
        
        // Complete
        this.isAnimatingOpen = false;
    }

    setupBackground() {
        this.blurredBackground = document.createElement("div");
        this.blurredBackground.className = "gui-background";
        document.body.appendChild(this.blurredBackground);
        
        // Remove the click handler that closes the GUI when clicking on background
        // The user wants to keep the GUI open when clicking outside
    }

    createSearchBar() {
        // Create search container
        this.searchContainer = document.createElement("div");
        this.searchContainer.className = "gui-search-container";
        
        // Create search input wrapper
        const searchWrapper = document.createElement("div");
        searchWrapper.className = "gui-search-wrapper";
        
        // Create search icon
        const searchIcon = document.createElement("i");
        searchIcon.className = "fa fa-search gui-search-icon";
        
        // Create search input with more descriptive placeholder
        this.searchInput = document.createElement("input");
        this.searchInput.className = "gui-search-input";
        this.searchInput.placeholder = "Search modules...";
        this.searchInput.type = "text";
        
        // Add elements in the right order for proper styling
        searchWrapper.appendChild(this.searchInput);
        searchWrapper.appendChild(searchIcon);
        
        // Add a clear button for easier interaction - make it more visible
        const clearButton = document.createElement("span");
        clearButton.className = "gui-search-clear";
        clearButton.textContent = "×";
        clearButton.style.display = "none"; // Initially hidden
        searchWrapper.appendChild(clearButton);
        
        // Show/hide clear button based on input content and enter search mode
        this.searchInput.addEventListener("input", () => {
            clearButton.style.display = this.searchInput.value.length > 0 ? "block" : "none";
            
            // Enter search mode if there's input, exit if empty
            if (this.searchInput.value.length > 0) {
                this.enterSearchMode();
            } else {
                this.exitSearchMode();
            }
            
            this.performSearch();
        });
        
        // Clear search when button is clicked
        clearButton.addEventListener("click", () => {
            this.searchInput.value = "";
            clearButton.style.display = "none";
            this.searchResults.classList.remove("visible");
            this.searchResults.style.display = "none";
            this.exitSearchMode();
            this.searchInput.focus();
        });
        
        this.searchContainer.appendChild(searchWrapper);
        
        // Create search results
        this.searchResults = document.createElement("div");
        this.searchResults.className = "gui-search-results";
        this.searchContainer.appendChild(this.searchResults);
        
        document.body.appendChild(this.searchContainer);
        
        // Make the entire search wrapper clickable to focus the input
        searchWrapper.addEventListener("click", (e) => {
            // Don't refocus if clicking on the clear button
            if (e.target !== clearButton) {
                this.searchInput.focus();
            }
        });
        
        this.searchInput.addEventListener("focus", () => {
            searchWrapper.classList.add("focused");
            if (this.searchInput.value.length > 0) {
                this.enterSearchMode();
                this.performSearch();
            }
        });
        
        this.searchInput.addEventListener("blur", () => {
            setTimeout(() => {
                searchWrapper.classList.remove("focused");
                
                // Only exit search mode if the click wasn't within the search container
                // which means the user clicked somewhere else
                if (!this.searchContainer.contains(document.activeElement) && 
                    !this.searchContainer.matches(':hover')) {
                    this.exitSearchMode();
                }
            }, 100);
        });
        
        // Add keyboard navigation for search results
        this.setupSearchKeyboardNavigation();
        
        // Generate all modules list for search
        this.allModules = Object.values(moduleManager.modules);
        
        // Add escape key handler to exit search mode
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && document.body.classList.contains("search-mode")) {
                this.searchInput.value = "";
                clearButton.style.display = "none";
                this.searchResults.classList.remove("visible");
                this.searchResults.style.display = "none";
                this.exitSearchMode();
            }
        });
    }
    
    setupSearchKeyboardNavigation() {
        let currentFocusIndex = -1;
        
        this.searchInput.addEventListener("keydown", (e) => {
            const results = this.searchResults.querySelectorAll(".gui-search-result");
            
            // Handle arrow keys for navigation
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (results.length > 0) {
                    currentFocusIndex = (currentFocusIndex + 1) % results.length;
                    this.focusSearchResult(results, currentFocusIndex);
                }
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (results.length > 0) {
                    currentFocusIndex = currentFocusIndex <= 0 ? results.length - 1 : currentFocusIndex - 1;
                    this.focusSearchResult(results, currentFocusIndex);
                }
            } else if (e.key === "Enter") {
                // Toggle the currently focused module
                if (currentFocusIndex >= 0 && currentFocusIndex < results.length) {
                    results[currentFocusIndex].click();
                }
            } else if (e.key === "Escape") {
                // Close search results
                this.searchResults.classList.remove("visible");
                setTimeout(() => {
                    this.searchResults.style.display = "none";
                    currentFocusIndex = -1;
                }, 300);
            }
        });
    }
    
    focusSearchResult(results, index) {
        // Remove focus from all results
        results.forEach(result => result.classList.remove("focused"));
        
        // Add focus to the selected result
        results[index].classList.add("focused");
        
        // Scroll the result into view if needed
        results[index].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    
    performSearch() {
        const query = this.searchInput.value.toLowerCase().trim();
        
        // Clear and hide results if query is empty
        if (query.length < 1) {
            this.searchResults.innerHTML = "";
            this.searchResults.style.display = "none";
            this.searchResults.classList.remove("visible");
            this.exitSearchMode();
            return;
        }
        
        // Otherwise, enter search mode and show results
        this.enterSearchMode();
        this.searchResults.innerHTML = "";
        
        // Fast fuzzy search algorithm
        const matchedModules = this.allModules
            .map(module => {
                const nameMatch = module.name.toLowerCase().includes(query) ? 2 : 0;
                const descMatch = module.description.toLowerCase().includes(query) ? 1 : 0;
                const categoryMatch = module.category.toLowerCase() === query ? 1 : 0;
                const score = nameMatch + descMatch + categoryMatch;
                return { module, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score || a.module.name.localeCompare(b.module.name))
            .map(item => item.module);
        
        if (matchedModules.length === 0) {
            const noResults = document.createElement("div");
            noResults.className = "gui-search-no-results";
            noResults.textContent = "No modules found";
            this.searchResults.appendChild(noResults);
        } else {
            // Store these modules to ensure we're toggling the correct one
            this.searchResultModules = matchedModules;
            
            matchedModules.forEach((module, index) => {
                const result = document.createElement("div");
                result.className = "gui-search-result";
                result.setAttribute("data-module-index", index);
                
                // Add enabled class if module is enabled
                if (module.isEnabled) {
                    result.classList.add("enabled");
                }
                
                const moduleName = document.createElement("span");
                moduleName.className = "gui-search-result-name";
                
                // Highlight the matching part of the name
                const lowerName = module.name.toLowerCase();
                const matchIndex = lowerName.indexOf(query);
                
                if (matchIndex !== -1 && query.length > 0) {
                    const before = module.name.substring(0, matchIndex);
                    const match = module.name.substring(matchIndex, matchIndex + query.length);
                    const after = module.name.substring(matchIndex + query.length);
                    
                    moduleName.innerHTML = before + 
                        `<span class="highlight">${match}</span>` + 
                        after;
                } else {
                    moduleName.textContent = module.name;
                }
                
                const moduleCategory = document.createElement("span");
                moduleCategory.className = "gui-search-result-category";
                moduleCategory.textContent = module.category;
                
                result.appendChild(moduleName);
                result.appendChild(moduleCategory);
                
                result.addEventListener("click", (e) => {
                    // Get the exact module index from the clicked element
                    const moduleIndex = parseInt(result.getAttribute("data-module-index"));
                    // Make sure the index is valid
                    if (moduleIndex >= 0 && moduleIndex < this.searchResultModules.length) {
                        const clickedModule = this.searchResultModules[moduleIndex];
                        // Toggle the specific module
                        clickedModule.toggle();
                        
                        // Update the visual state to match the module's enabled state
                        if (clickedModule.isEnabled) {
                            result.classList.add("enabled");
                        } else {
                            result.classList.remove("enabled");
                        }
                    }
                });
                
                this.searchResults.appendChild(result);
            });
        }
        
        // Show results
        this.searchResults.style.display = "block";
        this.searchResults.classList.add("visible");
    }

    createPanels() {
        const panelConfigs = [
            { title: "Combat", position: { top: "100px", left: "100px" } },
            { title: "Movement", position: { top: "100px", left: "320px" } },
            { title: "Visual", position: { top: "100px", left: "540px" } },
            { title: "Misc", position: { top: "100px", left: "760px" } }
        ];

        this.panels.forEach(panel => {
            if (panel.panel && panel.panel.parentNode) {
                panel.panel.parentNode.removeChild(panel.panel);
            }
        });
        this.panels = [];

        panelConfigs.forEach(config => {
            const panel = new Panel(config.title, config.position);
            this.panels.push(panel);
        });

        const modulesByCategory = {};
        Object.values(moduleManager.modules).forEach(module => {
            if (!modulesByCategory[module.category]) {
                modulesByCategory[module.category] = [];
            }
            modulesByCategory[module.category].push(module);
        });

        Object.entries(modulesByCategory).forEach(([category, modules]) => {
            const panel = this.panels.find(p => p.header.textContent === category);
            if (!panel) return;

            modules.sort((a, b) => a.name.localeCompare(b.name));
            modules.forEach((module, index) => {
                const button = panel.addButton(module);
                button.style.setProperty('--index', index);
            });
        });
    }

    setupEventListeners() {
        events.on("module.update", (module) => {
            const panel = this.panels.find(p => p.header.textContent === module.category);
            if (!panel) return;
            
            const button = panel.buttons.find(btn => btn.textContent === module.name);
            if (button) {
                button.classList.toggle("enabled", module.isEnabled);
            }
            
            // Update search results if visible
            if (this.searchResults && this.searchResults.style.display !== "none") {
                // Find and update any matches in search results
                const searchResultElements = this.searchResults.querySelectorAll(".gui-search-result");
                
                // Loop through all current search results
                searchResultElements.forEach(resultElement => {
                    const moduleIndex = parseInt(resultElement.getAttribute("data-module-index"));
                    if (moduleIndex >= 0 && moduleIndex < this.searchResultModules.length) {
                        const resultModule = this.searchResultModules[moduleIndex];
                        
                        // If this search result is for the module that was updated
                        if (resultModule === module) {
                            // Update the enabled state visually
                            if (module.isEnabled) {
                                resultElement.classList.add("enabled");
                            } else {
                                resultElement.classList.remove("enabled");
                            }
                        }
                    }
                });
            }
        });
        
        // Close search results when clicking outside
        document.addEventListener("click", (e) => {
            if (!this.searchContainer.contains(e.target) && this.searchResults.style.display !== "none") {
                this.searchResults.classList.remove("visible");
                setTimeout(() => {
                    this.searchResults.style.display = "none";
                    this.searchInput.value = "";
                }, 300);
            }
        });
        
        // Prevent background click closing GUI
        this.searchContainer.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        // Special handling for Visual modules to prevent bugs
        events.on("module.toggle", (module) => {
            // Handle Visual modules specially to prevent bugs
            if (module.category === "Visual" && 
                (module.name === "Arraylist" || module.name === "Watermark")) {
                // If ClickGUI is enabled and we're enabling another visual module, handle it carefully
                if (this.isEnabled && module.isEnabled) {
                    // Store current state and re-apply after a delay
                    setTimeout(() => {
                        if (this.isEnabled) {
                            // Refresh the GUI to ensure visual modules render properly
                            this.panels.forEach(panel => {
                                const button = panel.buttons.find(btn => btn.textContent === module.name);
                                if (button) button.classList.toggle("enabled", module.isEnabled);
                            });
                        }
                    }, 50);
                }
            }
            
            // Special handling for ClickGUI itself
            if (module.name === "ClickGUI") {
                // Refresh other visual modules when ClickGUI is toggled
                Object.values(moduleManager.modules).forEach(m => {
                    if (m.category === "Visual" && m !== module && m.isEnabled) {
                        // Re-apply enabled state to ensure proper rendering
                        const panel = this.panels.find(p => p.header.textContent === m.category);
                        if (panel) {
                            const button = panel.buttons.find(btn => btn.textContent === m.name);
                            if (button) button.classList.toggle("enabled", m.isEnabled);
                        }
                    }
                });
            }
        });
        
        // Add keyboard shortcut for closing the GUI
        document.addEventListener("keydown", (e) => {
            if (this.isEnabled && e.key === "Escape") {
                this.toggle();
            }
        });
    }

    showGUI() {
        this.panels.forEach(panel => panel.show());
        this.blurredBackground.style.display = "block";
        this.searchContainer.style.display = "block";
        
        // Animate in the GUI
        this.animateOpeningSequence();
    }

    onDisable() {
        // Animate the closing sequence
        this.animateClosingSequence();
    }
    
    animateClosingSequence() {
        // Hide everything immediately
        this.panels.forEach(panel => panel.hide());
        this.blurredBackground.style.display = "none";
        this.searchContainer.style.display = "none";
        this.searchResults.style.display = "none";
        this.searchInput.value = "";
        
        // Return focus to game if needed
        const gameCanvas = document.getElementById("noa-canvas");
        if (gameCanvas) {
            gameCanvas.focus();
            gameCanvas.requestPointerLock();
        }
    }

    onSettingUpdate() {
        this.updateColors();
        this.updateAnimations();
    }

    setupScrollAnimations() {
        // Apply smooth scroll behavior to all scrollable containers
        const scrollableContainers = document.querySelectorAll('.gui-button-container, .gui-search-results, .module-settings, .gui-settings-wrapper');
        
        scrollableContainers.forEach(container => {
            container.classList.add('smooth-scroll');
            
            // Create scroll indicator
            const scrollIndicator = document.createElement('div');
            scrollIndicator.className = 'scroll-indicator';
            container.appendChild(scrollIndicator);
            
            // Add scroll event listener
            container.addEventListener('scroll', this.debounce(() => {
                // Update scroll indicator position and size
                this.updateScrollIndicator(container, scrollIndicator);
                
                // Add active scrolling class temporarily
                container.classList.add('scrolling-active');
                setTimeout(() => container.classList.remove('scrolling-active'), 1000);
                
                // Apply staggered reveal to visible elements
                this.revealVisibleElements(container);
            }, 10));
            
            // Initialize scroll indicator
            this.updateScrollIndicator(container, scrollIndicator);
            
            // Store wheel event handler reference
            const wheelHandler = this.smoothScrollHandler.bind(this, container);
            container.addEventListener('wheel', wheelHandler, { passive: false });
            
            // Track these to clean up later if needed
            this.scrollObservers.push({
                container,
                indicator: scrollIndicator,
                wheelHandler
            });
        });
    }
    
    updateScrollIndicator(container, indicator) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const scrollPercent = scrollTop / (scrollHeight - clientHeight);
        const indicatorHeight = Math.max(30, (clientHeight / scrollHeight) * clientHeight);
        
        indicator.style.height = `${indicatorHeight}px`;
        indicator.style.top = `${scrollPercent * (clientHeight - indicatorHeight)}px`;
        
        // Show indicator only if container is scrollable
        indicator.style.opacity = scrollHeight > clientHeight ? '1' : '0';
    }
    
    smoothScrollHandler(container, e) {
        if (!this.options["Enable Animations"]) return;
        
        e.preventDefault();
        
        const scrollAmount = e.deltaY * 0.5; // Adjust the multiplier to control smoothness
        const smoothness = parseFloat(this.options["Scrolling Smoothness"]);
        
        // Use requestAnimationFrame for smoother scrolling
        this.smoothScroll(container, scrollAmount, smoothness);
    }
    
    smoothScroll(element, scrollAmount, smoothness) {
        const startPosition = element.scrollTop;
        const targetPosition = startPosition + scrollAmount;
        const startTime = performance.now();
        const duration = 400 * smoothness; // Adjust duration based on smoothness setting
        
        const scrollStep = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-out function for natural deceleration
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            
            element.scrollTop = startPosition + (targetPosition - startPosition) * easeOutCubic;
            
            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            }
        };
        
        requestAnimationFrame(scrollStep);
    }
    
    revealVisibleElements(container) {
        // Find all buttons or search results in the container
        const items = container.querySelectorAll('.gui-button, .gui-search-result, .gui-setting-container');
        
        items.forEach((item, index) => {
            // Check if element is visible in the viewport
            const rect = item.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            const isVisible = (
                rect.top >= containerRect.top &&
                rect.bottom <= containerRect.bottom
            );
                    
                    if (isVisible) {
                item.style.setProperty('--index', index % 20);
                
                // Add appear class if not already visible
                if (!item.classList.contains('appeared')) {
                    item.classList.add('appeared');
                }
            }
        });
    }
    
    setupIntersectionObservers() {
        // We're no longer using animations for elements when they come into view
        // This entire method can be simplified to avoid flashing
        
        // Use a simple observer to handle any necessary updates without animations
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            // Just mark elements as appeared, no animations
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Just mark elements as visible without animations
                    const container = entry.target;
                    const items = container.querySelectorAll('.gui-button, .gui-search-result, .gui-setting-container');
                    
                    items.forEach(item => {
                        // Just add the appeared class to prevent animations
                        if (!item.classList.contains('appeared')) {
                            item.classList.add('appeared');
                        }
                    });
                }
            });
        }, options);
        
        // Observe containers
        document.querySelectorAll('.gui-button-container, .gui-search-results').forEach(container => {
            observer.observe(container);
        });
    }

    // Enhanced debounce with immediate option
    debounce(func, wait, immediate = false) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Create a unique ID for module settings
    getModuleSettingId(module) {
        if (!this.moduleSettingIds.has(module)) {
            this.moduleSettingIds.set(module, this.nextSettingId++);
        }
        return this.moduleSettingIds.get(module);
    }

    // Enter search mode - hide panels and show only search
    enterSearchMode() {
        // Add transition class first
        document.body.classList.add("search-mode-enter");
        
        // Force layout reflow
        document.body.offsetHeight;
        
        // Then add search mode class
        document.body.classList.add("search-mode");
        
        // Remove transition class after a short delay
        setTimeout(() => {
            document.body.classList.remove("search-mode-enter");
        }, 100);
    }

    // Exit search mode - show everything again
    exitSearchMode() {
        if (this.searchInput.value.length === 0) {
            // Add transition class first
            document.body.classList.add("search-mode-exit");
            
            // Remove search mode
            document.body.classList.remove("search-mode");
            
            // Hide search elements
            this.searchResults.classList.remove("visible");
            this.searchResults.style.display = "none";
            
            // Remove transition class after animation completes
            setTimeout(() => {
                document.body.classList.remove("search-mode-exit");
            }, 200);
        }
    }
}