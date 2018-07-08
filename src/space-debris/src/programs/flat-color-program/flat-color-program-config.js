/**
 * This module defines the configuration for a WebGL program that renders objects with just a plain,
 * flat color.
 */

const flatColorProgramWrapperConfig = {};

flatColorProgramWrapperConfig.id = 'flat-color-program';

// The build system moves shader files to dist/shaders/.
flatColorProgramWrapperConfig.vertexShaderPath = 'shaders/flat-color-shader.vert';
flatColorProgramWrapperConfig.fragmentShaderPath = 'shaders/flat-color-shader.frag';

// This should render after the stars; all stars should appear behind the other objects.
flatColorProgramWrapperConfig.renderPriority = 3;

/**
 * @param {WebGLRenderingContext} gl
 */
flatColorProgramWrapperConfig.webGLStateSetter = gl => {
  // Turn on depth testing.
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  // Turn on alpha blending.
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};

/**
 * This can be assigned as the draw method for a class that extends StandardModelController and uses
 * the flat-color program.
 *
 * @this StandardModelController
 */
flatColorProgramWrapperConfig.draw = function() {
  // Update the model-view matrix.
  mat4.multiply(this._mvMatrix, this._getViewMatrix(), this._worldTransform);

  // Update the uniform variables.
  this._programVariablesConfig.uniforms['uPMatrix'] = this._getProjectionMatrix();
  this._programVariablesConfig.uniforms['uMVMatrix'] = this._mvMatrix;

  // Draw shapes using the current variables configuration.
  this._programWrapper.draw(this._gl, this._programVariablesConfig, 0, this._model.elementCount);
};

/**
 * This can be assigned as the _setUpProgramVariablesConfig method for a class that extends
 * StandardModelController and uses the flat-color program.
 *
 * @this StandardModelController
 */
flatColorProgramWrapperConfig.setUpProgramVariablesConfig = function() {
  this._programVariablesConfig = {
    attributes: {
      aVertexPosition: this._model.vertexPositionsConfig,
    },
    uniforms: {
      uPMatrix: this._getProjectionMatrix(),
      uMVMatrix: this._mvMatrix,
      uColor: this._color,
    },
    mode: this._model.mode,
    vertexIndices: this._model.vertexIndicesBuffer,
    elementCount: this._model.elementCount
  };
};

export {flatColorProgramWrapperConfig};
