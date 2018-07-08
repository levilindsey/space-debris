import {
  configController,
  FixedCamera,
  GameScene,
  WallController,
}
from '../../../../gamex';

import { sceneConfig } from './scene-config';
import {
  boxFolderConfig,
  cameraConfig,
  cameraFolderConfig,
  capsuleFolderConfig,
  fixedCameraConfig,
  fixedCameraFolderConfig,
  generalConfig,
  generalFolderConfig,
  physicsFolderConfig,
  sphereFolderConfig,
  wallConfig,
}
from '../../config';
import { TriggerCollisionConfigController } from '../trigger-collision/trigger-collision-config-controller';
import { DropObjectConfigController } from '../drop-object/drop-object-config-controller';

/**
 * This class handles the overall scene.
 *
 * This includes:
 * - the background
 * - all objects in the foreground
 * - all light sources
 * - the camera
 */
class SceneImpl extends GameScene {
  /**
   * @param {ModelGroupControllerConfig} modelControllerParams
   * @param {GameController} gameCtrl
   * @param {InputController} inputCtrl
   */
  constructor(modelControllerParams, gameCtrl, inputCtrl) {
    super(modelControllerParams, gameCtrl, inputCtrl, sceneConfig.renderDistance);

    this._wallCtrl = null;
    this._dropBallCtrl = null;
    this._triggerCollisionCtrl = null;

    this._createModelControllers();
    this._createConfigController();

    this._camera = new FixedCamera(fixedCameraConfig, cameraConfig);
  }

  _createModelControllers() {
    this._wallCtrl = new WallController({
      gl: this._gl,
      getViewMatrix: this._getViewMatrix,
      getProjectionMatrix: this._getProjectionMatrix,
      getParentWorldTransform: this._getWorldTransform,
      programWrapperId: wallConfig.shaderProgram,
      texturePath: wallConfig.texturePath,
    }, {
      x: null,
      y: null,
      z: -50,
      isOpenOnPositiveSide: true,
      thickness: wallConfig.thickness,
      halfSideLength: wallConfig.halfSideLength,
      useSmoothShading: wallConfig.useSmoothShading,
      textureSpan: wallConfig.textureSpan,
    });
    this._dropBallCtrl = new DropObjectConfigController({
      gl: this._gl,
      getViewMatrix: this._getViewMatrix,
      getProjectionMatrix: this._getProjectionMatrix,
      getParentWorldTransform: this._getWorldTransform,
    });
    this._triggerCollisionCtrl = new TriggerCollisionConfigController({
      gl: this._gl,
      getViewMatrix: this._getViewMatrix,
      getProjectionMatrix: this._getProjectionMatrix,
      getParentWorldTransform: this._getWorldTransform,
    });
    this._modelCtrls = [
      this._wallCtrl,
      this._dropBallCtrl,
      this._triggerCollisionCtrl,
    ];
  }

  _createConfigController() {
    configController.createFolder(physicsFolderConfig);
    configController.createFolder(generalFolderConfig, null, {
      'texturePath': () => this._updateTexture(),
      'shaderProgram': () => this._updateProgramWrapper(),
      'clearObjects': () => this._clearObjects(),
    });
    configController.createFolder(boxFolderConfig);
    configController.createFolder(capsuleFolderConfig);
    configController.createFolder(sphereFolderConfig);
    configController.createFolder(cameraFolderConfig);
    // TODO: Update this to support other types of cameras being selected.
    configController.createFolder(fixedCameraFolderConfig, null, {
      // These trigger an update within the camera.
      'viewDirection': () => this._camera.viewDirection = this._camera.viewDirection,
      'position': () => this._camera.position = this._camera.position
    });
  }

  _updateTexture() {
    if (this._dropBallCtrl) {
      this._dropBallCtrl.updateTexture(generalConfig.texturePath);
    }
    if (this._triggerCollisionCtrl) {
      this._triggerCollisionCtrl.updateTexture(generalConfig.texturePath);
    }
  }

  _updateProgramWrapper() {
    if (this._dropBallCtrl) {
      this._dropBallCtrl.updateProgramWrapper(generalConfig.shaderProgram);
    }
    if (this._triggerCollisionCtrl) {
      this._triggerCollisionCtrl.updateProgramWrapper(generalConfig.shaderProgram);
    }
  }

  _clearObjects() {
    if (this._dropBallCtrl) {
      this._dropBallCtrl.clearModelControllers();
    }
    if (this._triggerCollisionCtrl) {
      this._triggerCollisionCtrl.clearModelControllers();
    }
  }
}

export { SceneImpl };
