/**
 * This module defines the configuration for a WebGL program that combines two images together.
 */

import {programWrapperStore, create2DSquarePositionsConfig} from '../../../../gamex';

const blendProgramWrapperConfig = {};

blendProgramWrapperConfig.id = 'blend-program';

// The build system moves shader files to dist/shaders/.
blendProgramWrapperConfig.vertexShaderPath = 'shaders/post-processor-shader.vert';
blendProgramWrapperConfig.fragmentShaderPath = 'shaders/blend-shader.frag';

let _positionsConfig = null;
let _programVariablesConfig = null;

/** @param {WebGLRenderingContext} gl */
blendProgramWrapperConfig.initialize = gl => {
  _positionsConfig = create2DSquarePositionsConfig(gl);
  _programVariablesConfig = {
    attributes: {
      aVertexPosition: _positionsConfig,
    },
    uniforms: {
      uModelsSampler: null,
      uBrightnessSampler: null,
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
blendProgramWrapperConfig.getProgramVariablesConfig = (gl, inputFramebufferIds) => {
  _programVariablesConfig.uniforms.uModelsSampler =
      programWrapperStore.getTexture(inputFramebufferIds[0]);
  _programVariablesConfig.uniforms.uBrightnessSampler =
      programWrapperStore.getTexture(inputFramebufferIds[1]);
  return _programVariablesConfig;
};

export {blendProgramWrapperConfig};
