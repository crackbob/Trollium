import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

let packets = [];
export default class Derp extends Module {
    constructor () {
        super("Derp", "Spin around like crazy.", "Misc", {
            "Speed": 1,
            "Backwards": false,
        })
        this.realHeading = 0;
        this.fakeHeading = 0;
        this.realPitch = 0;
        this.fakePitch = 0;
        this.spinIndex = 0;
    }

    onEnable () {
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

        hooks.noa.entities._storage.playerMesh.list[0].namedNodes.HeadMesh.rotation.__defineGetter__("_x", () => (this.fakePitch + 180) % 360)
        hooks.noa.entities._storage.playerMesh.list[0].namedNodes.HeadMesh.rotation.__defineSetter__("_x", () => (this.fakePitch + 180) % 360)
        hooks.noa.entities._storage.playerMesh.list[0].rootMesh.rotation.__defineGetter__("_y", () => (this.fakeHeading + 180) % 360)
        hooks.noa.entities._storage.playerMesh.list[0].rootMesh.rotation.__defineSetter__("_y", () => (this.fakeHeading + 180) % 360)
    }

    onGameTick() {
        if (this.options["Backwards"] === "true") {
            this.fakePitch = (this.realPitch + 180) % 360;
            this.fakeHeading = (this.realHeading + 180) % 360;
        } else {
            this.spinIndex += (this.options.Speed / 10) % 360;
            this.fakePitch = this.spinIndex;
            this.fakeHeading = this.spinIndex;
        }

        hooks.noa.entities._storage.playerMesh.list[0].namedNodes.HeadMesh.rotation._x =  this.realPitch;
        hooks.noa.entities._storage.playerMesh.list[0].namedNodes.HeadMesh.rotation._y =  this.realHeading;
    }

    onDisable () {
        delete hooks.noa.camera.heading;
        delete hooks.noa.camera.pitch;

        hooks.noa.camera.heading = this.realHeading;
        hooks.noa.camera.pitch = this.realPitch;

        delete hooks.noa.entities._storage.playerMesh.list[0].namedNodes.HeadMesh.rotation._x;
        delete hooks.noa.entities._storage.playerMesh.list[0].rootMesh.rotation._y;
    }

    onGameEntered() {
        this.onEnable();
    }
};