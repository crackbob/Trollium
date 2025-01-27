export default {
    config: JSON.parse(localStorage["trollium-config"] || `{
        "modules": {
            "Arraylist": { "isEnabled": true },
            "Watermark": { "isEnabled": true }
        }
    }`),
    update() {
        localStorage["trollium-config"] = JSON.stringify(this.config);
    },
    export () {
        const blob = new Blob([JSON.stringify(this.config)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "config.json";
        link.click();
        URL.revokeObjectURL(link.href);
    },
    import (str) {
        this.config = JSON.parse(str);
        this.update();
    }
}