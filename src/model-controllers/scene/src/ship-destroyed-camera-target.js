import {
  applyAngularDrag,
  InvisibleModelController,
  PhysicsJob,
  PhysicsModelController,
  PhysicsState,
} from 'gamex';
import {physicsConfig} from '../../../config';

/**
 * This controller renders nothing but does continue to update its state, so that it can serve as a
 * camera target after the ship has been destroyed.
 *
 * It's initial state is based on the ship's last state.
 */
class ShipDestroyedCameraTarget extends PhysicsModelController {
  /**
   * @param {ShipController} shipCtrl
   */
  constructor(shipCtrl) {
    // Use an invisible model controller that maintains state, but renders nothing.
    const modelCtrlParams = {
      gl: shipCtrl.modelCtrl._gl,
      getViewMatrix: shipCtrl.modelCtrl._getViewMatrix,
      getProjectionMatrix: shipCtrl.modelCtrl._getProjectionMatrix,
      getParentWorldTransform: shipCtrl.modelCtrl._getParentWorldTransform,
    };
    const modelCtrl = new InvisibleModelController(modelCtrlParams);

    // Copy the ship's last state.
    const physicsJob = new PhysicsJob();
    physicsJob.currentState = new PhysicsState(shipCtrl.physicsJob.currentState);
    physicsJob.previousState = new PhysicsState(shipCtrl.physicsJob.previousState);
    physicsJob.renderState = new PhysicsState(shipCtrl.physicsJob.renderState);

    const forceAppliers = [
      applyAngularDrag.bind(null, physicsConfig),
    ];

    super(modelCtrl, physicsJob, undefined, forceAppliers);
  }
}

export { ShipDestroyedCameraTarget };
