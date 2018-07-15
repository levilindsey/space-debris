/**
 * This module handles configuration parameters relating to input controls.
 */

const inputConfig = {};

// TODO: Change these to not be Dvorak-based.

inputConfig.shipShootTorpedoKey = 'u';
inputConfig.shipForwardThrusterKey = 'e';
inputConfig.shipStabilizerKey = 'o';
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
