import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

let packets = [];
export default class Derp extends Module {
    constructor () {
        super("Derp", "Spin around like crazy.", "Misc")
        this.realHeading = 0;
        this.fakeHeading = 0;
        this.realPitch = 0;
        this.fakePitch = 0;
        this.spinIndex = 0;
    }

    onEnable () {
        if (!gameUtils.inGame) return;

        this.realHeading = hooks.noa.camera.heading;
        this.realPitch = hooks.noa.camera.pitch;
        hooks.noa.camera.__defineGetter__("heading", () => {
            try {
                null.test();
            } catch (error) {
                if (error.stack.includes("Object.system")) {
                    return this.fakeHeading;
                }
            }
            return this.realHeading;
        })
        hooks.noa.camera.__defineSetter__("heading", (value) => {
            this.realHeading = value;
        })

        hooks.noa.camera.__defineGetter__("pitch", () => {
            try {
                null.test();
            } catch (error) {
                if (error.stack.includes("Object.system")) {
                    return this.fakePitch;
                }
            }
            return this.realPitch;
        })
        hooks.noa.camera.__defineSetter__("pitch", (value) => {
            this.realPitch = value;
        })

        hooks.noa.entities._storage.playerMesh.list[0].namedNodes.HeadMesh.rotation.__defineGetter__("_x", () => this.fakePitch)
        hooks.noa.entities._storage.playerMesh.list[0].namedNodes.HeadMesh.rotation.__defineSetter__("_x", () => this.fakePitch)
        hooks.noa.entities._storage.playerMesh.list[0].rootMesh.rotation.__defineGetter__("_y", () => this.fakeHeading)
        hooks.noa.entities._storage.playerMesh.list[0].rootMesh.rotation.__defineSetter__("_y", () => this.fakeHeading)
    }

    onGameTick() {
        this.spinIndex += 0.1 % 360;
        this.fakePitch = this.spinIndex;
        this.fakeHeading = this.spinIndex;
    }

    onDisable () {
        Object.defineProperty(hooks.noa.camera, "heading", {
            value: this.realHeading,
            enumerable: false
        })

        hooks.noa.entities._storage.playerMesh.list[0].namedNodes.HeadMesh.rotation.__defineGetter__("_x", () => this.realPitch)
        hooks.noa.entities._storage.playerMesh.list[0].namedNodes.HeadMesh.rotation.__defineSetter__("_x", () => this.realPitch)
        hooks.noa.entities._storage.playerMesh.list[0].rootMesh.rotation.__defineGetter__("_y", () => this.realHeading)
        hooks.noa.entities._storage.playerMesh.list[0].rootMesh.rotation.__defineSetter__("_y", () => this.realHeading)
    }

    onEnterWorld() {
        this.onEnable();
    }
};