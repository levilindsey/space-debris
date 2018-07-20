import {StandardModelController} from 'gamex';

import {flatColorProgramWrapperConfig} from '../../../programs';
import {shipConfig} from './ship-config';

/**
 * This class controls the ship's forward thruster.
 */
class ShipForwardThrusterController extends StandardModelController {
  /**
   * @param {ModelControllerConfig} modelControllerParams
   * @param {Function.<boolean>} getIsThrusterActive
   */
  constructor(modelControllerParams, getIsThrusterActive) {
    modelControllerParams.programWrapperId = shipConfig.forwardThrusterShaderProgram;
    delete modelControllerParams.texturePath;

    const shapeParams = {
      shapeId: 'SHIP_FORWARD_THRUSTER',
      shipWidth: shipConfig.shipWidth,
      shipLength: shipConfig.shipLength,
      shipDepth: shipConfig.shipDepth,
      shipRearWingExtensionLength: shipConfig.shipRearWingExtensionLength,
      shipForwardThrusterMarginRatio: shipConfig.forwardThrusterMarginRatio,
      shipForwardThrusterLength: shipConfig.forwardThrusterLength,
    };

    super(modelControllerParams, shapeParams);

    this._color = vec4.fromValues(
        shipConfig.forwardThrusterColor.rgbVec[0],
        shipConfig.forwardThrusterColor.rgbVec[1],
        shipConfig.forwardThrusterColor.rgbVec[2],
        shipConfig.forwardThrusterColorAlpha,
    );
    this._getIsThrusterActive = getIsThrusterActive;
  }

  update(currentTime, deltaTime) {}

  draw() {
    if (this._getIsThrusterActive()) {
      flatColorProgramWrapperConfig.draw.call(this);
    }
  }
}

// Re-use methods that are common for the flat-color program.
ShipForwardThrusterController.prototype._setUpProgramVariablesConfig =
    flatColorProgramWrapperConfig.setUpProgramVariablesConfig;

export {ShipForwardThrusterController};
