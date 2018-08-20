/**
 * This module handles configuration parameters relating to input controls.
 */

const inputConfig = {};

// TODO: Remove these Dvorak-based alternatives.
// inputConfig.shipShootTorpedoKey = 'u';
// inputConfig.shipForwardThrusterKey = 'e';
// inputConfig.shipStabilizerKey = 'o';

inputConfig.shipShootTorpedoKey = 's';
inputConfig.shipForwardThrusterKey = 'd';
inputConfig.shipStabilizerKey = 'f';
inputConfig.shipPitchThrusterUpKey = 'UP';
inputConfig.shipPitchThrusterDownKey = 'DOWN';
inputConfig.shipYawThrusterLeftKey = 'LEFT';
inputConfig.shipYawThrusterRightKey = 'RIGHT';
inputConfig.pauseKeys = ['SPACE', 'ESCAPE'];

inputConfig.allKeys = [
  inputConfig.shipShootTorpedoKey,
  inputConfig.shipForwardThrusterKey,
  inputConfig.shipStabilizerKey,
  inputConfig.shipPitchThrusterUpKey,
  inputConfig.shipPitchThrusterDownKey,
  inputConfig.shipYawThrusterLeftKey,
  inputConfig.shipYawThrusterRightKey,
  ...inputConfig.pauseKeys,
];

export {inputConfig};
