import {ModelGroupController} from '../../../gamex';

/**
 * This class defines some shared simulation behavior.
 */
class SimulationConfigController extends ModelGroupController {
  /**
   * @param {ModelGroupControllerConfig} modelGroupControllerParams
   */
  constructor(modelGroupControllerParams) {
    super(modelGroupControllerParams);

    // A stationary object to demo the parameters before running a simulation.
    //this._demoObject = this._createNewObject(true);// TODO: Add the demo object back in.

    // TODO: Remove these after changing the camera type from Follow.
    this.position = vec3.create();
    this.orientation = quat.create();
  }

  reset() {
    this.clearModelControllers();
    //this._demoObject.reset();
  }

  /**
   * @param {string} texturePath
   */
  updateTexture(texturePath) {
    //this._demoObject.texturePath = texturePath;
    this._modelCtrls.forEach(object => object.texturePath = texturePath);
  }

  /**
   * @param {string} id
   */
  updateProgramWrapper(id) {
    //this._demoObject.id = id;
    this._modelCtrls.forEach(object => object.programWrapperId = id);
  }
}

export {SimulationConfigController};
