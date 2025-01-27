import eventManager from "./events/manager";

export default {
    "wpRequire": null,
    "noa": null,
    "bloxdEvents": null,
    "sendPacket": null,
    "init" () {
        let ACKey = Object.keys(window).find(key => key.includes("."));
        let ACFunc = window[ACKey];
        window.__defineGetter__(ACKey, function () {
            try {
                null.test();
            } catch (e) {
                if (!e.stack.includes(".js")) {
                    return ()=>{}
                }
            }
            return ACFunc;
        })

        let wpRequire;
        webpackChunkbloxd.push([[{ some: () => { } }], {}, function (require) {
            Object.prototype.__defineGetter__(Symbol.for("cache"), function () {
                require.c = this;
                delete Object.prototype[Symbol.for("cache")];
                return { exports: {} };
            });
            require(Symbol.for("cache"));
            wpRequire = require;
            webpackChunkbloxd.splice(webpackChunkbloxd.findIndex(chunk => chunk[2]), 1);
        }]);

        let updateHook = (noa) => this.noa = noa;

        let mHookID = Object.keys(wpRequire.m)[Object.values(wpRequire.m).findIndex(m => m.toString().includes("renderTickLocalPlayer(){"))];
        let _renderTickLocalPlayer = wpRequire(mHookID).HeldItem.prototype.renderTickLocalPlayer;
        wpRequire(mHookID).HeldItem.prototype.renderTickLocalPlayer = function () {
            updateHook(this.noa);
            eventManager.emit("gameTick");
            return _renderTickLocalPlayer.apply(this, arguments);
        }

        this.wpRequire = wpRequire;

        // ingame event system
        let eventCheck = (exports) => Object.values(exports).find(prop => prop?._eventsCount);
        this.bloxdEvents = eventCheck(Object.values(wpRequire.c).find(module => eventCheck(module.exports)).exports);

        // packet sender
        let packetCheck = (exports) => Object.values(exports).find(prop => prop?.toString().includes("push({message"));
        this.sendPacket = packetCheck(Object.values(wpRequire.c).find(module => packetCheck(module.exports)).exports);

        let _publish = this.bloxdEvents.publish;

        this.bloxdEvents.publish = function (event, data) {
            if (event == "chat" && data.content[0].str.translationKey == "classicGame:cantAttackCloseToSpawn") {
                return;
            }
            return _publish.apply(this, arguments);
        }
    }
}