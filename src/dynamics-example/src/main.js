import {GameController, PhysicsEngine} from '../../gamex';
import {physicsConfig} from './config';
import {SceneImpl} from './model-controllers/scene/scene-impl';
import {generalModelProgramWrapperConfig} from './programs';

/**
 * This script defines the top-level logic that bootstraps the application.
 */

window.addEventListener('load', _initApp, false);

/**
 * Initializes the app. This is the event handler for the completion of the DOM loading.
 *
 * @private
 */
function _initApp() {
  console.debug('onDocumentLoad');

  window.removeEventListener('load', _initApp);

  const canvas = document.getElementById('game-area');
  const controller = new GameController();
  const programConfigs = [generalModelProgramWrapperConfig];
  const textures = [
    'images/textures/test-image.png',
    'images/textures/metal/metal1.png',
    'images/textures/metal/metal2.png',
    'images/textures/metal/metal3.png',
    'images/textures/metal/metal4.png',
    'images/textures/metal/metal5.png',
    'images/textures/metal/metal6.png',
    'images/textures/metal/metal7.png',
    'images/textures/metal/metal8.png'
  ];
  PhysicsEngine.create(physicsConfig);

  controller.initialize(canvas, programConfigs, textures, SceneImpl)
      .then(() => controller.run());
}
