import hooks from "../../../hooks";
import Module from "../../module";

export default class ViewModel extends Module {
    constructor () {
        super("ViewModel", "Allows you to change the offset of items in your hand.", "Visual", {
            "Spin": false,
            "Spin Speed": 1,
            "X": -0.05,
            "Y": 0.05,
            "Z": 0.05
        })
    }

    get heldItemState () {
        return hooks.noa?.ents.getHeldItemState(hooks.noa.playerEntity).heldItem;
    }

    onEnable () {
        if (this?.heldItemState?.firstPersonPosOffset) {
            this.heldItemState.firstPersonPosOffset._x = parseFloat(this.options.X);
            this.heldItemState.firstPersonPosOffset._y = parseFloat(this.options.Y);
            this.heldItemState.firstPersonPosOffset._z = parseFloat(this.options.Z);
        }
    }

    onGameTick () {
        if (this.options["Spin"] && this?.heldItemState?.firstPersonRotation) {
            let deg = this.heldItemState.firstPersonRotation.y;
            deg = (deg + this.options["Spin Speed"]) % 181;
            this.heldItemState.firstPersonRotation.y = deg;
        }
    }

    onSettingUpdate() {
        if (!this.options["Spin"] && this?.heldItemState?.firstPersonRotation) {
            this.heldItemState.firstPersonRotation.y = 0;
        }
        this.onEnable();
    }

    onDisable () {
        if (this?.heldItemState?.firstPersonRotation) {
            this.heldItemState.firstPersonRotation.y = 0;
        }

        if (this?.heldItemState?.firstPersonPosOffset) {
            this.heldItemState.firstPersonPosOffset._x = 0;
            this.heldItemState.firstPersonPosOffset._y = 0;
            this.heldItemState.firstPersonPosOffset._z = 0;
        }
    }

    onGameEntered () {
        this.onEnable();
    }
};