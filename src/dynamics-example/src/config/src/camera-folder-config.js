import {
  cameraConfig,
  fixedCameraConfig,
  followCameraConfig,
  cameraConfigUpdaters
} from './camera-config';

/**
 * This module configures the camera dat.GUI menu folder.
 */

const fixedCameraFolderConfig = {
  label: 'Fixed Camera',
  config: fixedCameraConfig,
  isOpen: true,
  onChangeListeners: {
    'viewDirection': cameraConfigUpdaters.normalizeFixedViewDirection
  }
};

const followCameraFolderConfig = {
  label: 'Follow Camera',
  config: followCameraConfig,
  isOpen: false,
  onChangeListeners: {
    'intendedDistanceFromTarget': cameraConfigUpdaters.updateIntendedTranslationFromTarget,
    'intendedRotationAngleFromTarget': cameraConfigUpdaters.updateIntendedTranslationFromTarget,
    'intendedRotationAxisFromTarget': cameraConfigUpdaters.updateIntendedTranslationFromTarget
  }
};

const cameraFolderConfig = {
  label: 'Camera',
  config: cameraConfig,
  isOpen: true
};

export {cameraFolderConfig, fixedCameraFolderConfig, followCameraFolderConfig};
