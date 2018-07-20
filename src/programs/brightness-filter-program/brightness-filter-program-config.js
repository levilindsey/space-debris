/**
 * This module defines the configuration for a WebGL program that processes an image to render only
 * the bright areas.
 */

import {programWrapperStore, create2DSquarePositionsConfig} from 'gamex';

const brightnessProgramWrapperConfig = {};

brightnessProgramWrapperConfig.id = 'brightness-program';

// The build system moves shader files to dist/shaders/.
brightnessProgramWrapperConfig.vertexShaderPath = 'shaders/post-processor-shader.vert';
brightnessProgramWrapperConfig.fragmentShaderPath = 'shaders/brightness-filter-shader.frag';

let _positionsConfig = null;
let _programVariablesConfig = null;

/** @param {WebGLRenderingContext} gl */
brightnessProgramWrapperConfig.initialize = gl => {
  _positionsConfig = create2DSquarePositionsConfig(gl);
  _programVariablesConfig = {
    attributes: {
      aVertexPosition: _positionsConfig,
    },
    uniforms: {
      uSampler: null,
    },
    mode: gl.TRIANGLES,
    elementCount: 6,
  };
};

/**
 * @param {WebGLRenderingContext} gl
 * @param {Array.<string>} inputFramebufferIds
 * @returns {ProgramVariablesConfig}
 */
brightnessProgramWrapperConfig.getProgramVariablesConfig = (gl, inputFramebufferIds) => {
  _programVariablesConfig.uniforms.uSampler =
      programWrapperStore.getTexture(inputFramebufferIds[0]);
  return _programVariablesConfig;
};

export {brightnessProgramWrapperConfig};
