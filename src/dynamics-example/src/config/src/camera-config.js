/**
 * This module handles configuration parameters relating to the camera. This uses the dat.GUI
 * package.
 */

// TODO: Tie this into the folder-config system.

import {degToRad} from '../../../../gamex';

const cameraConfig = {};

cameraConfig.fovY = degToRad(70.0);
cameraConfig.zNear = 0.1;
cameraConfig.zFar = 4000;
cameraConfig.defaultAspectRatio = 16 / 9;
cameraConfig._defaultLookAtDirection = vec3.fromValues(0, 0, -1);

const fixedCameraConfig = {};

fixedCameraConfig.position = {
  start: vec3.fromValues(0, -40, 5),
  min: vec3.fromValues(-200, -200, -200),
  max: vec3.fromValues(200, 200, 200)
};
fixedCameraConfig.viewDirection = {
  start: vec3.fromValues(0, 1, -.5),
  min: vec3.fromValues(-1, -1, -1),
  max: vec3.fromValues(1, 1, 1)
};
fixedCameraConfig._up = vec3.fromValues(0, 0, 1);

const followCameraConfig = {};

followCameraConfig.springCoefficient = 0.003;
followCameraConfig.dampingCoefficient = 0.09;

followCameraConfig.intendedDistanceFromTarget = {
  start: 6,
  min: 0,
  max: 100
};
followCameraConfig.intendedRotationAngleFromTarget = {
  start: -Math.PI * .15,
  min: 0,
  max: 2 * Math.PI
};
followCameraConfig.intendedRotationAxisFromTarget = vec3.fromValues(1, 0, 0);
followCameraConfig._intendedTranslationFromTarget = vec3.create();

function updateIntendedTranslationFromTarget() {
  const transformation = mat4.create();
  mat4.rotate(
      transformation,
      transformation,
      followCameraConfig.intendedRotationAngleFromTarget,
      followCameraConfig.intendedRotationAxisFromTarget);
  mat4.translate(
      transformation,
      transformation,
      vec3.fromValues(0, 0, followCameraConfig.intendedDistanceFromTarget));
  vec3.transformMat4(
      followCameraConfig._intendedTranslationFromTarget,
      followCameraConfig._intendedTranslationFromTarget,
      transformation);
}

const normalizeFixedViewDirection =
    () => vec3.normalize(fixedCameraConfig.viewDirection, fixedCameraConfig.viewDirection);
const normalizeDefaultLookAtDirection =
    () => vec3.normalize(cameraConfig._defaultLookAtDirection,
        cameraConfig._defaultLookAtDirection);

const cameraConfigUpdaters = {
  updateIntendedTranslationFromTarget: updateIntendedTranslationFromTarget,
  normalizeFixedViewDirection: normalizeFixedViewDirection,
  normalizeDefaultLookAtDirection: normalizeDefaultLookAtDirection,
};

normalizeDefaultLookAtDirection();

export {cameraConfig, fixedCameraConfig, followCameraConfig, cameraConfigUpdaters};
