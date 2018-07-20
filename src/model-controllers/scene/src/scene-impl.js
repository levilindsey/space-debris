import {
  configController,
  GameScene,
  shallowCopy,
}
from 'gamex';

import {
  cameraConfig,
  cameraFolderConfig,
  cameraTypeMap,
  firstPersonCameraConfig,
  firstPersonCameraFolderConfig,
  fixedCameraConfig,
  fixedCameraFolderConfig,
  followCameraConfig,
  followCameraFolderConfig,
  physicsFolderConfig,
}
from '../../../config';

import { sceneConfig } from './scene-config';

import { ChunkController } from '../../../core/chunk-controller';

import {
  TorpedoesController,
  torpedoesConfig,
  torpedoesFolderConfig,
}
from '../../torpedo';
import {
  AsteroidsController,
  asteroidsConfig,
  asteroidsFolderConfig,
}
from '../../asteroid';
import {
  ShipController,
  shipConfig,
  shipFolderConfig,
}
from '../../ship';
import {
  StarsController,
  starsFolderConfig,
}
from '../../star';
import {
  // UfosController,
  ufosConfig,
  ufosFolderConfig,
}
from '../../ufo';

import { ShipDestroyedCameraTarget } from './ship-destroyed-camera-target';

/**
 * This class handles the overall scene.
 *
 * This includes:
 * - the background,
 * - all objects in the foreground,
 * - all light sources.
 */
class SceneImpl extends GameScene {
  /**
   * @param {ModelGroupControllerConfig} modelControllerParams
   * @param {GameController} gameCtrl
   * @param {InputController} inputCtrl
   */
  constructor(modelControllerParams, gameCtrl, inputCtrl) {
    super(modelControllerParams, gameCtrl, inputCtrl, sceneConfig.renderDistance);

    this._asteroidsCtrl = null;
    this._torpedoesCtrl = null;
    this._shipCtrl = null;
    this._starsCtrl = null;
    this._ufosCtrl = null;
    this._chunkCtrl = null;
    // This is either _shipCtrl or _shipDestroyedCameraTarget depending on whether the game is over.
    this._shipProxy = null;
    this._shipDestroyedCameraTarget = null;
    this._camera = null;
    this._chunkListeners = [];

    this._createConfigController();
    this._createChunkController();
    this._isReadyPromise = this._createModelControllers(inputCtrl);
    this._createCamera();
  }

  reset() {
    super.reset();

    this._shipDestroyedCameraTarget = null;
  }

  /**
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   */
  updateChildren(currentTime, deltaTime) {
    super.updateChildren(currentTime, deltaTime);
    // The scene position follows the ship position.
    this.centerOfVolume = this._shipProxy.position;
    this._chunkCtrl.update(this.centerOfVolume);
  }

  destroyShip() {
    // Update the camera target, since we're removing the ship.
    this._shipDestroyedCameraTarget = new ShipDestroyedCameraTarget(this._shipCtrl);
    this._startModelController(this._shipDestroyedCameraTarget).then(() => {
      this._shipProxy = this._shipDestroyedCameraTarget;
      this._createCamera();
      this._onModelControllerDestroyed(this._shipCtrl);
    });

    // TODO: Trigger explosion animation.
  }

  /**
   * @param {InputController} inputCtrl
   * @returns {Promise}
   */
  _createModelControllers(inputCtrl) {
    const getWorldTransform = () => this.worldTransform;
    const getCameraPosition = () => this._camera.position;
    const getShipPosition = () => this._shipProxy.position;
    const getShipVelocity = () => this._shipProxy.velocity;
    const modelControllerParams = {
      gl: this._gl,
      getViewMatrix: this._getViewMatrix,
      getProjectionMatrix: this._getProjectionMatrix,
      getParentWorldTransform: getWorldTransform,
    };

    this._asteroidsCtrl = new AsteroidsController(shallowCopy(modelControllerParams),
      this._gameCtrl.scoreCtrl, getShipPosition, getShipVelocity);
    this._torpedoesCtrl = new TorpedoesController(shallowCopy(modelControllerParams),
      getShipPosition);
    this._shipCtrl =
      new ShipController(shallowCopy(modelControllerParams), inputCtrl, this._gameCtrl.healthCtrl,
        this._torpedoesCtrl);
    this._shipProxy = this._shipCtrl;
    this._starsCtrl = new StarsController(shallowCopy(modelControllerParams), getCameraPosition);
    // TODO
    // this._ufosCtrl = new UfosController(modelControllerParams, getShipPosition, getShipVelocity,
    //     this._torpedoesCtrl);

    return this._startModelControllers();
  }

  /**
   * @returns {Promise}
   * @private
   */
  _startModelControllers() {
    const modelCtrls = [
      this._asteroidsCtrl,
      this._torpedoesCtrl,
      this._shipCtrl,
      this._starsCtrl,
      // this._ufosCtrl,
    ];

    return Promise.all(modelCtrls.map(modelCtrl => this._startModelController(modelCtrl)))
      .then(() => {
        this._chunkListeners.push(this._starsCtrl);
        this._chunkCtrl.reset(this.centerOfVolume);
      });
  }

  _createChunkController() {
    this._chunkCtrl = new ChunkController(
      this.centerOfVolume,
      sceneConfig.chunkSideLength,
      sceneConfig.chunkCountOnASide,
      this._chunkListeners);
  }

  _createCamera() {
    // Get the class for the currently selected camera type.
    const cameraType = cameraConfig.cameraType instanceof Object ?
      cameraConfig.cameraType.start : cameraConfig.cameraType;
    const cameraClass = cameraTypeMap[cameraType];
    const cameraTarget = this._createCameraTarget();

    const cameraTypeToFactory = {
      'firstPerson': () =>
        new cameraClass(cameraTarget, firstPersonCameraConfig, cameraConfig,
          this._camera),
      'thirdPersonSpring': () =>
        new cameraClass(cameraTarget, followCameraConfig, cameraConfig, this._camera),
      'thirdPersonFixed': () =>
        new cameraClass(cameraTarget, followCameraConfig, cameraConfig, this._camera),
      'fixed': () => new cameraClass(fixedCameraConfig, cameraConfig, this._camera),
    };

    this._camera = cameraTypeToFactory[cameraType]();
  }

  /**
   * @returns {Promise}
   */
  getIsReady() {
    return this._isReadyPromise;
  }

  /**
   * @returns {CameraTarget}
   * @private
   */
  _createCameraTarget() {
    const shipProxy = this._shipProxy;

    // Create a proxy object to translate "position" to "renderPosition" and "orientation" to
    // "renderOrientation".
    return {
      get position() {
        return shipProxy.renderPosition;
      },
      get orientation() {
        return shipProxy.renderOrientation;
      },
      get worldTransform() {
        return shipProxy.worldTransform;
      },
    };
  }

  // TODO: Add configs

  _createConfigController() {
    configController.createFolder(asteroidsFolderConfig, null, {
      'texturePath': () => this._updateAsteroidsTexture(),
      'shaderProgram': () => this._updateAsteroidsProgramWrapper(),
    });
    configController.createFolder(torpedoesFolderConfig, null, {
      'shaderProgram': () => this._updateTorpedoesProgramWrapper(),
    });
    configController.createFolder(shipFolderConfig, null, {
      'texturePath': () => this._updateShipTexture(),
      'shaderProgram': () => this._updateShipProgramWrapper(),
    });
    // configController.createFolder(ufosFolderConfig, null, {
    //   'texturePath': () => this._updateUfosTexture(),
    //   'shaderProgram': () => this._updateUfosProgramWrapper(),
    // });
    configController.createFolder(starsFolderConfig);
    configController.createFolder(physicsFolderConfig);
    configController.createFolder(cameraFolderConfig, null, {
      'cameraType': () => this._createCamera(),
    });
    configController.createFolder(followCameraFolderConfig, null, {});
    configController.createFolder(firstPersonCameraFolderConfig, null, {});
    configController.createFolder(fixedCameraFolderConfig, null, {});
  }

  _updateAsteroidsTexture() {
    if (this._asteroidsCtrl) {
      this._asteroidsCtrl.updateTexture(asteroidsConfig.texturePath);
    }
  }

  _updateShipTexture() {
    if (this._shipCtrl) {
      this._shipCtrl.updateTexture(shipConfig.texturePath);
    }
  }

  _updateUfosTexture() {
    if (this._ufosCtrl) {
      this._ufosCtrl.updateTexture(ufosConfig.texturePath);
    }
  }

  _updateAsteroidsProgramWrapper() {
    if (this._asteroidsCtrl) {
      this._asteroidsCtrl.updateProgramWrapper(asteroidsConfig.shaderProgram);
    }
  }

  _updateShipProgramWrapper() {
    if (this._shipCtrl) {
      this._shipCtrl.updateProgramWrapper(shipConfig.shaderProgram);
    }
  }

  _updateTorpedoesProgramWrapper() {
    if (this._torpedoesCtrl) {
      this._torpedoesCtrl.updateProgramWrapper(torpedoesConfig.shaderProgram);
    }
  }

  _updateUfosProgramWrapper() {
    if (this._ufosCtrl) {
      this._ufosCtrl.updateProgramWrapper(ufosConfig.shaderProgram);
    }
  }
}

export { SceneImpl };
