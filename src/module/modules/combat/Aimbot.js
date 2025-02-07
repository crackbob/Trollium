import Module from "../../module";
import hooks from "../../../hooks";
import mathUtils from "../../../utils/mathUtils";
import gameUtils from "../../../utils/gameUtils";

export default class Aimbot extends Module {
    constructor () {
        super("Aimbot", "Targets camera at player.", "Combat", {
            "Require Click": true,
            "Target Closest Player": true,
            "Turn Camera": true,
            "Smoothing": 0.2,
            "Y Offset": 0
        })
        
        this.currentHeading = 0;
        this.currentPitch = 0;
        this.lastTime = Date.now();
        this.currentTarget = null;
        this.targetPos = null;
    }

    initializeTargetPos() {
        const dir = hooks.noa.camera._dirVector;
        const pos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);
        this.targetPos = [
            pos[0] + dir[0] * 5,
            pos[1] + dir[1] * 5,
            pos[2] + dir[2] * 5
        ];
    }

    aimAtPos (targetPos) {
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastTime) / 16.67;
        this.lastTime = currentTime;

        if (!this.targetPos) {
            this.initializeTargetPos();
        }

        this.targetPos[1] += parseFloat(this.options["Y Offset"]);

        let smoothing = Math.max(0.01, Math.min(1, this.options["Smoothing"] * deltaTime));
        this.targetPos = this.targetPos.map((curr, i) => 
            curr + (targetPos[i] - curr) * smoothing
        );

        let localPlayerPos = hooks.noa.ents.getPosition(hooks.noa.playerEntity);
        let normalizedVector = mathUtils.normalizeVector([
            this.targetPos[0] - localPlayerPos[0], 
            this.targetPos[1] - localPlayerPos[1], 
            this.targetPos[2] - localPlayerPos[2]
        ]);

        if (this.options["Turn Camera"]) {
            let targetHeading = Math.atan2(normalizedVector[0], normalizedVector[2]);
            let targetPitch = Math.asin(-normalizedVector[1]);

            this.currentHeading = this.currentHeading + (targetHeading - this.currentHeading) * smoothing;
            this.currentPitch = this.currentPitch + (targetPitch - this.currentPitch) * smoothing;
            
            hooks.noa.camera.heading = this.currentHeading;
            hooks.noa.camera.pitch = this.currentPitch;
        }

        hooks.noa.camera._dirVector = hooks.noa.camera._dirVector.map((curr, i) => 
            curr + (normalizedVector[i] - curr) * smoothing
        );
    }

    onGameTick () {
        if (this.options["Require Click"] && !hooks.noa.inputs.state.fire) {
            this.currentTarget = null;
            this.targetPos = null;
            return;
        }

        if (this.options["Target Closest Player"]) {
            let closestPlayer = gameUtils.getClosestAttackablePlayer();
            if (closestPlayer !== this.currentTarget) {
                this.currentTarget = closestPlayer;
                if (!this.currentTarget) return;
            }
            if (this.currentTarget) {
                this.aimAtPos(hooks.noa.ents.getPositionData(this.currentTarget).position);
            }
        } else {
            gameUtils.getPlayerList().forEach((player) => {
                this.aimAtPos(hooks.noa.ents.getPositionData(player).position);
            });
        }
    }
};