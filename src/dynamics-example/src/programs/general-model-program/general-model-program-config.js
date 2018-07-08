/**
 * This module defines the configuration for a WebGL program that renders a general model--that is,
 * this program renders everything but the stars.
 *
 * This program renders three-dimensional shapes with textures and Blinn-Phong shading.
 */

const generalModelProgramWrapperConfig = {};

generalModelProgramWrapperConfig.id = 'general-model-program';

// The build system moves shader files to dist/shaders/.
generalModelProgramWrapperConfig.vertexShaderPath = 'shaders/general-model-shader.vert';
generalModelProgramWrapperConfig.fragmentShaderPath = 'shaders/general-model-shader.frag';

generalModelProgramWrapperConfig.renderPriority = 1;

/**
 * @param {WebGLRenderingContext} gl
 */
generalModelProgramWrapperConfig.webGLStateSetter = gl => {
  // Turn on depth testing.
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
};

export {generalModelProgramWrapperConfig};
