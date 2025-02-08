import hooks from "../../../hooks";
import mathUtils from "../../../utils/mathUtils";
import gameUtils from "../../../utils/gameUtils";
import Module from "../../module";

export default class ESP extends Module {
    constructor () {
        super("ESP", "See players through walls.", "Visual")
    }

    ESPMatList = []

    onGameTick () {
        gameUtils.getPlayerList().forEach((playerID) => {
            if (!this.ESPMatList[playerID]) {
                let ESPMesh = hooks.wpRequire(3012).i.CreatePlane(`${playerID.toString()}-ESP`, {
                    height: 1.8,
                    width: 1
                }, hooks.noa.rendering.getScene());

                let playerMesh = hooks.noa.ents.getMeshData(playerID);
                let planeEId = hooks.noa.entities.add([0, 0, 0], 1, 1, ESPMesh, [0, 0, 0]);
                
                let materialCreator = hooks.wpRequire(1322).e;
                
                const material = new materialCreator(`${playerID.toString()}-ESPMat`, hooks.noa.rendering.getScene());
                material.specularColor = { r: 255, g: 0, b: 0 };
                material.ambientColor = { r: 255, g: 0, b: 0 };
                material.emissiveColor = { r: 255, g: 0, b: 0 };
                ESPMesh.material = material;
                
                ESPMesh.parent = playerMesh.mesh._children[0];
                window.ass = ESPMesh;
                
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

    onGameEntered () {
        this.onEnable();
    }
};