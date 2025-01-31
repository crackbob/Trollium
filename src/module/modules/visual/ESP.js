import hooks from "../../../hooks";
import mathUtils from "../../../utils/mathUtils";
import gameUtils from "../../../utils/gameUtils";
import Module from "../../Module";

export default class ESP extends Module {
    constructor () {
        super("ESP", "See players through walls.", "Visual", "", "")
    }

    ESPMatList = []

    onGameTick () {
        gameUtils.getPlayerList().forEach((playerID) => {
            if (!this.ESPMatList[playerID]) {
                let ESPMesh = hooks.wpRequire(3184).e.CreatePlane(`${playerID.toString()}-ESP`, {
                    height: 1.8,
                    width: 1
                }, hooks.noa.rendering.getScene());
                
                let planeEId = hooks.noa.entities.add([0, 0, 0], 1, 1, ESPMesh, [0, 0, 0]);
                ESPMesh.billboardMode = 7;
                ESPMesh.alwaysSelectAsActiveMesh = !0;
                ESPMesh.doNotSyncBoundingInfo = !0;
                ESPMesh.renderingGroupId = 1;
                ESPMesh._absolutePosition._y += 3
                
                let materialCreator = hooks.wpRequire(1272).d;
                
                const material = new materialCreator(`${playerID.toString()}-ESPMat`, hooks.noa.rendering.getScene());
                material.specularColor = { r: 255, g: 0, b: 0 };
                material.ambientColor = { r: 255, g: 0, b: 0 };
                material.emissiveColor = { r: 255, g: 0, b: 0 };
                material.wireframe = true;
                ESPMesh.material = material;
                
                this.ESPMatList[playerID] = material;
                hooks.noa.ents.addComponent(planeEId, hooks.noa.ents.names.followsEntity, {
                    entity: playerID
                })
            } else {
                this.ESPMatList[playerID]._alpha = 1;
            }
        })
    }

    onDisable () {
        Object.values(this.ESPMatList).forEach(mat => mat._alpha = 0);
    }

    onEnterWorld () {
        this.onEnable();
    }
};