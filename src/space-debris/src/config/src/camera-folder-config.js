import {
  cameraConfig,
  firstPersonCameraConfig,
  fixedCameraConfig,
  followCameraConfig,
  cameraConfigUpdaters
} from './camera-config';

/**
 * This module configures the camera dat.GUI menu folder.
 */

const firstPersonCameraFolderConfig = {
  label: 'First-person camera',
  config: firstPersonCameraConfig,
  isOpen: false,
  onChangeListeners: {
    'viewDirection': cameraConfigUpdaters.normalizeFirstPersonViewDirection
  }
};

const fixedCameraFolderConfig = {
  label: 'Fixed camera',
  config: fixedCameraConfig,
  isOpen: false,
  onChangeListeners: {
    'viewDirection': cameraConfigUpdaters.normalizeFixedViewDirection
  }
};

const followCameraFolderConfig = {
  label: 'Follow camera',
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

export {cameraFolderConfig, firstPersonCameraFolderConfig, fixedCameraFolderConfig, followCameraFolderConfig};
