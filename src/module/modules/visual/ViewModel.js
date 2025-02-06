import hooks from "../../../hooks";
import Module from "../../module";

export default class ViewModel extends Module {
    constructor () {
        super("ViewModel", "Allows you to change the offset of items in your hand.", "Visual", null, "")
        this.options = {
            "Spin": false
        }
    }

    get heldItemState () {
        return hooks.noa?.ents.getHeldItemState(hooks.noa.playerEntity).heldItem;
    }

    onEnable () {
        if (gameUtils.inGame && this?.heldItemState?.firstPersonPosOffset) {
            this.heldItemState.firstPersonPosOffset._x = -0.05;
            this.heldItemState.firstPersonPosOffset._y = 0.05;
            this.heldItemState.firstPersonPosOffset._z = 0.05;
        }
    }

    onGameTick () {
        if (this.options["Spin"] && this?.heldItemState?.firstPersonRotation) {
            let deg = this.heldItemState.firstPersonRotation.y;
            deg = (deg + 0.05) % 181;
            this.heldItemState.firstPersonRotation.y = deg;
        }
    }

    onSettingUpdate() {
        if (!this.options["Spin"] && this?.heldItemState?.firstPersonRotation) {
            this.heldItemState.firstPersonRotation.y = 0;
        }
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

    onEnterWorld () {
        this.onEnable();
    }
};