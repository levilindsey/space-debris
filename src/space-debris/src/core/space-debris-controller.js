import {
  animator,
  GameController,
}
from '../../../gamex';

import { inputConfig } from '../config';
import { HealthController } from './health-controller';
import { ScoreController } from './score-controller';

/**
 * This top-level Controller class initializes and runs the rest of the app.
 */
class SpaceDebrisController extends GameController {
  constructor() {
    super();

    this._pauseScreen = document.querySelector('.pause-screen');
    this._title = document.querySelector('.title');
    this._playButton = document.querySelector('button.play');
    this._toastPanel = document.querySelector('.toast');

    const healthMeter = document.querySelector('.health .current');
    const scorePanel = document.querySelector('.score');

    this.healthCtrl = new HealthController(healthMeter, this.endGame.bind(this));
    this.scoreCtrl = new ScoreController(scorePanel);

    this._setElementListeners();
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Array.<ProgramWrapperConfig>} programConfigs Configurations for program wrappers that
   * should be pre-cached before starting the rest of the app.
   * @param {Array.<String>} texturePaths Texture images that should be pre-cached before
   * starting the rest of the app.
   * @param {Function.<Scene>} SceneImpl A class that extends GameScene.
   * @returns {Promise}
   */
  initialize(canvas, programConfigs, texturePaths, SceneImpl) {
    return super.initialize(canvas, programConfigs, texturePaths, SceneImpl)
      .then(() => this._setPauseKeyListeners());
  }

  run() {
    super.run();
    this.isGameOver = false;
    this._title.innerHTML = 'Paused';
  }

  endGame() {
    this._scene.destroyShip();
    this.isGameOver = true;
    this._title.innerHTML = 'Game over';
    this._pauseScreen.style.display = 'block';
  }

  togglePause() {
    if (this.isPaused) {
      this.unpause();
    }
    else {
      this.pause();
    }
  }

  pause() {
    super.pause();
    this._pauseScreen.style.display = 'block';
  }

  unpause() {
    super.unpause();
    this._pauseScreen.style.display = 'none';
  }

  _setPauseKeyListeners() {
    inputConfig.pauseKeys.forEach(key =>
      this._inputCtrl.addKeyDownListener(key, () => this.togglePause()));
  }

  _setElementListeners() {
    this._playButton.addEventListener('click', () => this._onPlayClicked(), false);
    this._pauseScreen.addEventListener('click', event => this._onScreenClicked(event), false);
  }

  _onPlayClicked() {
    if (this.isGameOver) {
      // FIXME: Start new game
    }
    else {
      this.unpause();
    }
  }

  _onScreenClicked(event) {
    // If the user clicks outside the pause menu, then we unpause.
    if (event.target === this._pauseScreen && !this.isGameOver) {
      this.unpause();
    }
  }
}

export { SpaceDebrisController };
