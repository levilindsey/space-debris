import { PhysicsEngine } from '../../gamex';

import { physicsConfig } from './config';
import { SpaceDebrisController } from './core/space-debris-controller';
import { SceneImpl } from './model-controllers/scene';
import {
  bloomProgramWrapperConfig,
  flatColorProgramWrapperConfig,
  generalModelProgramWrapperConfig,
  starPointsProgramWrapperConfig,
}
from './programs';

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

  const controller = new SpaceDebrisController();

  PhysicsEngine.create(physicsConfig);

  const canvas = document.getElementById('game-area');
  const programConfigs = [
    bloomProgramWrapperConfig,
    flatColorProgramWrapperConfig,
    generalModelProgramWrapperConfig,
    starPointsProgramWrapperConfig,
  ];
  const textures = [];
  controller.initialize(canvas, programConfigs, textures, SceneImpl)
    .then(() => controller.run());
}
