import Module from "../../module";

export default class UITweaks extends Module {
    constructor () {
        super("UI Tweaks", "Tweak Elements of the UI", "Visual", null)

        this.options = {
            "Hide Lobby": false,
            "Bottom Chat": false
        }
    }

    get chatElement () {
        return document.getElementsByClassName("Chat")[0];
    }

    get lobbyElement () {
        return document.getElementsByClassName("LobbyNameWrapper")[0];
    }

    onEnable () {
        if (this.chatElement?.style && this.options["Bottom Chat"]) {
            this.chatElement.style.position = "fixed";
            this.chatElement.style.bottom = "10%";
        }

        if (this.lobbyElement?.style && this.options["Hide Lobby"])  {
            this.lobbyElement.style.opacity = "0";
        }
    }

    onDisable () {
        if (this.chatElement?.style && this.options["Bottom Chat"]) {
            this.chatElement.style.position = "";
            this.chatElement.style.bottom = "";
        }

        if (this.lobbyElement?.style && this.options["Hide Lobby"])  {
            this.lobbyElement.style.opacity = "100";
        }
    }

    onSettingUpdate() {
        this.onEnable();
    }

    onGameEntered () {
        // give time for UI to render
        setTimeout(() => {
            if (this.chatElement?.style && this.options["Bottom Chat"]) {
                this.chatElement.style.position = "fixed";
                this.chatElement.style.bottom = "10%";
            }

            if (this.lobbyElement?.style && this.options["Hide Lobby"])  {
                this.lobbyElement.style.opacity = "0";
            }
        }, 3000)
    }
};