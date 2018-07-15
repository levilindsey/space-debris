import {
  animator,
  configController,
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

    this.healthCtrl = null;
    this.scoreCtrl = null;

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
    const healthMeter = document.querySelector('.health .current');
    const scorePanel = document.querySelector('.score');

    this.healthCtrl = new HealthController(healthMeter, this.endGame.bind(this));
    this.scoreCtrl = new ScoreController(scorePanel);

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
    this._updatePauseMenu();
    this._title.innerHTML = 'Game over';
    this._playButton.innerHTML = 'Play again';
    this._pauseScreen.style.display = 'block';
  }

  togglePause() {
    if (this.isPaused) {
      this.unpause();
    } else {
      this.pause();
    }
  }

  pause() {
    super.pause();
    this._updatePauseMenu();
    this._pauseScreen.style.display = 'block';
  }

  unpause() {
    super.unpause();
    this._pauseScreen.style.display = 'none';

    if (this.isGameOver) {
      this._restart();
    }
  }

  _updatePauseMenu() {
    const scoreField = document.querySelector('.pause-menu-score');
    const runTimeField = document.querySelector('.pause-menu-total-run-time');
    const scoreText = `${this.scoreCtrl.score} points`;
    const runTimeText = millisecondsToString(animator.totalRunTime);
    scoreField.innerHTML = scoreText;
    runTimeField.innerHTML = runTimeText;
  }

  _setPauseKeyListeners() {
    inputConfig.pauseKeys.forEach(key =>
      this._inputCtrl.addKeyDownListener(key, () => this.togglePause()));
  }

  _setElementListeners() {
    this._playButton.addEventListener('click', () => this.unpause(), false);
    this._pauseScreen.addEventListener('click', event => this._onScreenClicked(event), false);
  }

  _onScreenClicked(event) {
    // If the user clicks outside the pause menu, then we unpause.
    if (event.target === this._pauseScreen && !this.isGameOver) {
      this.unpause();
    }
  }

  // TODO: Remove this. This is needed, because right now, `reset` won't return the app to its
  //     starting state. Instead, we have to recreate everything.
  _restart() {
    window.location.reload(false);
  }
}

function millisecondsToString(totalMilliseconds) {
  const milliseconds = totalMilliseconds % 1000;
  let tmp = (totalMilliseconds - milliseconds) / 1000;
  const seconds = tmp % 60;
  tmp = (tmp - seconds) / 60;
  const minutes = tmp % 60;
  const hours = (tmp - minutes) / 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;

  function pad(number, digits=2) {
    return `00${number}`.slice(-digits);
  }
}

export { SpaceDebrisController };
