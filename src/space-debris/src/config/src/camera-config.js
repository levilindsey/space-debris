/**
 * This module handles configuration parameters relating to the camera. This uses the dat.GUI
 * package.
 */

// TODO: Tie this into the folder-config system.

import {
  degToRad,
  FirstPersonCamera,
  FixedCamera,
  FixedFollowCamera,
  SpringFollowCamera,
} from '../../../../gamex';

const cameraConfig = {};

cameraConfig.fovY = degToRad(70.0);
cameraConfig.zNear = 0.1;
cameraConfig.zFar = 4000;
cameraConfig.defaultAspectRatio = 16 / 9;
cameraConfig._defaultLookAtDirection = vec3.fromValues(0, 0, -1);
cameraConfig.cameraType = {
  start: 'thirdPersonSpring',
  options: [
    'firstPerson',
    'thirdPersonSpring',
    'thirdPersonFixed',
    'fixed',
  ]
};

const cameraTypeMap = {
  'firstPerson': FirstPersonCamera,
  'thirdPersonFixed': FixedFollowCamera,
  'thirdPersonSpring': SpringFollowCamera,
  'fixed': FixedCamera,
};

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

const firstPersonCameraConfig = {};

firstPersonCameraConfig.intendedDisplacementFromTarget = vec3.fromValues(0, 0.3, -0.8);
firstPersonCameraConfig.viewDirection = vec3.fromValues(0, 0, -1);
firstPersonCameraConfig.targetDistance = 10;

const followCameraConfig = {};

followCameraConfig.springCoefficient = 0.0004;
followCameraConfig.dampingCoefficient = 0.04;

followCameraConfig.intendedDistanceFromTarget = {
  start: 5,
  min: 0,
  max: 100
};
followCameraConfig.intendedRotationAngleFromTarget = {
  start: -Math.PI * .075,
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

const normalizeFirstPersonViewDirection =
    () => vec3.normalize(firstPersonCameraConfig.viewDirection,
        firstPersonCameraConfig.viewDirection);
const normalizeFixedViewDirection =
    () => vec3.normalize(fixedCameraConfig.viewDirection, fixedCameraConfig.viewDirection);
const normalizeDefaultLookAtDirection =
    () => vec3.normalize(cameraConfig._defaultLookAtDirection,
        cameraConfig._defaultLookAtDirection);

const cameraConfigUpdaters = {
  updateIntendedTranslationFromTarget: updateIntendedTranslationFromTarget,
  normalizeFirstPersonViewDirection: normalizeFirstPersonViewDirection,
  normalizeFixedViewDirection: normalizeFixedViewDirection,
  normalizeDefaultLookAtDirection: normalizeDefaultLookAtDirection
};

normalizeDefaultLookAtDirection();

export {
  cameraConfig,
  fixedCameraConfig,
  firstPersonCameraConfig,
  followCameraConfig,
  cameraConfigUpdaters,
  cameraTypeMap,
};
