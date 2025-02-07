import Module from "../../module";

export default class AntiBan extends Module {
    constructor () {
        super("AntiBan", "get unbanned easily", "Misc")
        this.packets = [];
    }

    onRender () {
        if (document.querySelector(".ErrorPopupTitleBody") && document.querySelector(".ErrorPopupTitleBody").textContent.includes("banned") && !document.querySelector(".ErrorPopupTitleBody").innerHTML.includes("Click to be unbanned.")) {
            var h1 = document.createElement("h1");
            h1.textContent = "Click to be unbanned.";
    
            document.querySelector(".ErrorPopupTitleBody").appendChild(h1);
    
            h1.addEventListener("click", function () {
                document.cookie.split(";").forEach(function (cookie) {
                    document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                location.reload();
            });
        }
    }
};