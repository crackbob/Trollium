export default {
    config: JSON.parse(localStorage["trollium-config"] || `{
        "modules": {
            "Arraylist": { "isEnabled": true },
            "Watermark": { "isEnabled": true }
        }
    }`),
    update() {
        localStorage["trollium-config"] = JSON.stringify(this.config);
    }
}