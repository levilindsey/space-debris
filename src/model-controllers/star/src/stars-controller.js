import {
  createBufferFromData,
  hslToRgb,
  ModelController,
  randomFloatInRange,
} from 'gamex';
import {starsConfig} from './stars-config';

/**
 * This class controls the stars.
 */
class StarsController extends ModelController {
  /**
   * @param {ModelControllerConfig} params
   * @param {Function.<vec3>} getCameraPosition
   */
  constructor(params, getCameraPosition) {
    params.programWrapperId = starsConfig.shaderProgram;

    super(params);

    this._getCameraPosition = getCameraPosition;
    this._programVariablesConfig = null;
    this._positionsConfig = null;
    this._sizesConfig = null;
    this._colorsConfig = null;
    this._mvMatrix = mat4.create();
    this._starsPerChunk = new Map();
  }

  /**
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   * @protected
   */
  update(currentTime, deltaTime) {
    // Do nothing here. Star updates occur when new chunks are created.
  }

  updateChildren(currentTime, deltaTime) {}

  draw() {
    // Update the model-view matrix.
    mat4.multiply(this._mvMatrix, this._getViewMatrix(), this._worldTransform);

    // Update the uniform variables.
    this._programVariablesConfig.uniforms['uCameraPosition'] = this._getCameraPosition();
    this._programVariablesConfig.uniforms['uPMatrix'] = this._getProjectionMatrix();
    this._programVariablesConfig.uniforms['uMVMatrix'] = this._mvMatrix;

    // Draw shapes using the current variables configuration.
    this._programWrapper.draw(this._gl, this._programVariablesConfig);
  }

  /**
   * Create new stars within the given chunk.
   *
   * @param {Chunk} chunk
   */
  onChunkCreated(chunk) {
    const starsForChunk = [];
    for (let i = 0; i < starsConfig.starCountPerChunk; i++) {
      starsForChunk.push({
        position: StarsController._getRandomPosition(chunk.bounds),
        size: StarsController._getRandomSize(),
        color: StarsController._getRandomColor()
      });
    }
    this._starsPerChunk.set(chunk.id, starsForChunk);
  }

  /**
   * Remove all stars from the given chunk.
   *
   * @param {Chunk} chunk
   */
  onChunkDestroyed(chunk) {
    this._starsPerChunk.delete(chunk.id);
  }

  onAllChunksUpdated() {
    this._updateBuffers();
  }

  /**
   * Initializes the program variables configuration.
   *
   * @protected
   */
  _setUpProgramVariablesConfig() {
    this._positionsConfig = {
      buffer: null,
      size: 3,
      type: this._gl.FLOAT,
      normalized: false,
      stride: 0,
      offset: 0
    };

    this._sizesConfig = {
      buffer: null,
      size: 1,
      type: this._gl.FLOAT,
      normalized: false,
      stride: 0,
      offset: 0
    };

    this._colorsConfig = {
      buffer: null,
      size: 3,
      type: this._gl.FLOAT,
      normalized: false,
      stride: 0,
      offset: 0
    };

    this._programVariablesConfig = {
      attributes: {
        aPosition: this._positionsConfig,
        aSize: this._sizesConfig,
        aColor: this._colorsConfig
      },
      uniforms: {
        uCameraPosition: this._getCameraPosition(),
        uPMatrix: this._getProjectionMatrix(),
        uMVMatrix: this._mvMatrix
      },
      mode: this._gl.POINTS,
      elementCount: null
    };
  }

  /**
   * Creates flattened arroys of the star positions, sizes, and colors and updates the WebGL buffers
   * with these arrays.
   *
   * @private
   */
  _updateBuffers() {
    const flattenedPositions = [];
    const flattenedSizes = [];
    const flattenedColors = [];
    let elementCount = 0;

    this._starsPerChunk.forEach(starsForChunk => {
      for (let i = 0, count = starsForChunk.length; i < count; i++, elementCount++) {
        const currentStar = starsForChunk[i];

        flattenedSizes[elementCount] = currentStar.size;

        for (let j = 0; j < 3; j++) {
          flattenedPositions[elementCount * 3 + j] = currentStar.position[j];
          flattenedColors[elementCount * 3 + j] = currentStar.color[j];
        }
      }
    });

    this._positionsConfig.buffer = createBufferFromData(this._gl, flattenedPositions,
        this._gl.ARRAY_BUFFER, this._gl.DYNAMIC_DRAW);
    this._sizesConfig.buffer = createBufferFromData(this._gl, flattenedSizes,
        this._gl.ARRAY_BUFFER, this._gl.DYNAMIC_DRAW);
    this._colorsConfig.buffer = createBufferFromData(this._gl, flattenedColors,
        this._gl.ARRAY_BUFFER, this._gl.DYNAMIC_DRAW);

    this._programVariablesConfig.elementCount = elementCount;
  }

  /**
   * @param {Aabb} bounds
   * @returns {vec3}
   * @private
   */
  static _getRandomPosition(bounds) {
    return vec3.fromValues(
        randomFloatInRange(bounds.minX, bounds.maxX),
        randomFloatInRange(bounds.minY, bounds.maxY),
        randomFloatInRange(bounds.minZ, bounds.maxZ));
  }

  /**
   * @returns {number}
   * @private
   */
  static _getRandomSize() {
    return randomFloatInRange(starsConfig.minSize, starsConfig.maxSize);
  }

  /**
   * @returns {vec3}
   * @private
   */
  static _getRandomColor() {
    const hsl = {
      h: randomFloatInRange(starsConfig.minHue, starsConfig.maxHue),
      s: randomFloatInRange(starsConfig.minSaturation, starsConfig.maxSaturation),
      l: randomFloatInRange(starsConfig.minLightness, starsConfig.maxLightness)
    };
    const rgb = hslToRgb(hsl);
    return vec3.fromValues(rgb.r, rgb.g, rgb.b);
  }
}

export {StarsController};

/**
 * @typedef {Object} Star
 * @property {vec3} position
 * @property {number} size
 * @property {vec3} color
 */
