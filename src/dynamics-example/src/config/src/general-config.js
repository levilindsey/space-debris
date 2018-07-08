/**
 * This module handles general configuration parameters.
 */

const generalConfig = {};

generalConfig.useSmoothShading = false;
generalConfig.texturePath = {
  start: 'images/textures/test-image.png',
  options: [
    'images/textures/test-image.png',
    'images/textures/metal/metal1.png',
    'images/textures/metal/metal2.png',
    'images/textures/metal/metal3.png',
    'images/textures/metal/metal4.png',
    'images/textures/metal/metal5.png',
    'images/textures/metal/metal6.png',
    'images/textures/metal/metal7.png',
    'images/textures/metal/metal8.png'
  ]
};
generalConfig.shaderProgram = {
  start: 'general-model-program',
  options: [
    'general-model-program',
    // TODO: Add others
  ]
};
// TODO: Use these
//generalConfig.color = {
//   h: ,
//   s: ,
//   l:
// };
//generalConfig.shader = ;
//generalConfig.lights = [
//    {
//        color: ,
//        x: ,
//        y: ,
//        z:
//    },
//    {
//        color: ,
//        x: ,
//        y: ,
//        z:
//    },
//    {
//        color: ,
//        x: ,
//        y: ,
//        z:
//    }
//];
//generalConfig.cameraType = ;
// TODO: Add other camera param configs

generalConfig.clearObjects = () => {};

const generalFolderConfig = {
  label: 'General',
  config: generalConfig,
  isOpen: true
};

export {generalConfig, generalFolderConfig};
