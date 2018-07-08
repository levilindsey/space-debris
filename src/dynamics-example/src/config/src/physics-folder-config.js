import {physicsConfig, physicsConfigUpdaters} from './physics-config';

/**
 * This module configures the physics dat.GUI menu folder.
 */

const physicsFolderConfig = {
  label: 'Physics Engine',
  config: physicsConfig,
  isOpen: false,
  onChangeListeners: {
    'gravity': physicsConfigUpdaters.updateGravity
  },
};

export {physicsFolderConfig};
