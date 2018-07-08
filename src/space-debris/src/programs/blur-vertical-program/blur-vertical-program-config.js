/**
 * This module defines the configuration for a WebGL program that processes an image to blur pixels
 * vertically.
 */

import {
  programWrapperStore,
  create2DSquarePositionsConfig,
  getViewportHeight,
  getViewportWidth,
} from '../../../../gamex';

const blurVerticalProgramWrapperConfig = {};

blurVerticalProgramWrapperConfig.id = 'blur-vertical-program';

// The build system moves shader files to dist/shaders/.
blurVerticalProgramWrapperConfig.vertexShaderPath = 'shaders/post-processor-shader.vert';
blurVerticalProgramWrapperConfig.fragmentShaderPath = 'shaders/blur-vertical-shader.frag';

let _positionsConfig = null;
let _programVariablesConfig = null;

/** @param {WebGLRenderingContext} gl */
blurVerticalProgramWrapperConfig.initialize = gl => {
  _positionsConfig = create2DSquarePositionsConfig(gl);
  _programVariablesConfig = {
    attributes: {
      aVertexPosition: _positionsConfig,
    },
    uniforms: {
      uSamplerSize: vec2.fromValues(getViewportWidth(), getViewportHeight()),
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
blurVerticalProgramWrapperConfig.getProgramVariablesConfig = (gl, inputFramebufferIds) => {
  _programVariablesConfig.uniforms.uSampler =
      programWrapperStore.getTexture(inputFramebufferIds[0]);
  vec2.set(_programVariablesConfig.uniforms.uSamplerSize, getViewportWidth(), getViewportHeight());
  return _programVariablesConfig;
};

export {blurVerticalProgramWrapperConfig};
