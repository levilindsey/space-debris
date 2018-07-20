/**
 * This module defines the configuration for a WebGL program that renders the stars.
 *
 * This program renders points with transparent radial gradients.
 */

const starPointsProgramWrapperConfig = {};

starPointsProgramWrapperConfig.id = 'star-points-program';

// The build system moves shader files to dist/shaders/.
starPointsProgramWrapperConfig.vertexShaderPath = 'shaders/star-points-shader.vert';
starPointsProgramWrapperConfig.fragmentShaderPath = 'shaders/star-points-shader.frag';

// This should render before the other objects; all stars should appear behind the other objects.
starPointsProgramWrapperConfig.renderPriority = 1;

/**
 * @param {WebGLRenderingContext} gl
 */
starPointsProgramWrapperConfig.webGLStateSetter = gl => {
  // Turn off depth testing.
  gl.disable(gl.DEPTH_TEST);

  // Turn on alpha blending.
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
};

export {starPointsProgramWrapperConfig};
