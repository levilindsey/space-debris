import {
  Aabb,
  areVec3sEqual,
  vec3ToString,
} from 'gamex';

/**
 * This class helps to render enough of the world around the current scene position, but not too
 * much. It does this by sub-dividing the scene space into three-dimensional cells called chunks.
 * When the scene center position moves into a new chunk, then some old chunks (that are being moved
 * away from) are destroyed and some new chunks (that are being moved towords) are created.
 *
 * Much of the documentation in this class mentions "chunk coordinates". (0,0,0) in chunk
 * coordinates is the same point as (0,0,0) in scene coordinates. However, chunk coordinates are
 * essentially indices into the three-dimensional grid of all possible chunk positions. Chunk
 * coordinates should always be integers
 */
class ChunkController {
  /**
   * Registers callbacks for creating and destroying chunks as the scene position changes.
   *
   * A new collection of chunks is rendered (and destroyed) every time the scene moves a distance of
   * chunkSideLength along any axis. A collection is all of the chunks along one face of the overall
   * scene bounding box.
   *
   * The add or delete handlers are called once for every chunk in the collection that's being added
   * or removed, respectively.
   *
   * The handlers are invoked with the following arguments:
   * - chunk: The chunk being added/removed.
   *
   * @param {vec3} sceneCenter The current scene center.
   * @param {number} chunkSideLength The axially-aligned length of one chunk (chunks are cubic).
   * @param {number} chunkCountOnASide The number of chunks to render along an axis. That is,
   * chunkCountOnASide^3 is the total number of chunks that will be rendered at a time.
   * @param {Array.<ChunkListener>} chunkListeners A collection of entities which will be informed
   * of all chunk events.
   */
  constructor(sceneCenter, chunkSideLength, chunkCountOnASide, chunkListeners) {
    this._chunkSideLength = chunkSideLength;
    this._chunkHalfSideLength = chunkSideLength / 2;
    // Ensure this is an even number.
    this._chunkCountOnASide =
        chunkCountOnASide % 2 === 0 ? chunkCountOnASide : chunkCountOnASide + 1;
    this._chunkListeners = chunkListeners;
    this._prevRenderSceneCenter = vec3.create();
    this._setChunkCoordinatePositionFromScenePosition(sceneCenter);
    this._chunks = new Map();
  }

  /**
   * Sets the scene center, destroys all old chunks, and creates all of the new chunks.
   *
   * @param {vec3} sceneCenter
   */
  reset(sceneCenter) {
    this._setChunkCoordinatePositionFromScenePosition(sceneCenter);
    this._destroyAllChunks();
    this._createAllChunks();
    this._chunkListeners.forEach(listener => listener.onAllChunksUpdated());
  }

  /**
   * Keeps track of when the scene center has moved to a new chunk. When it has, then destroy and
   * create new chunks according to the new scene position.
   *
   * @param {vec3} sceneCenter In scene coordinates.
   */
  update(sceneCenter) {
    // Convert the scene center to chunk coordinates.
    const centerInChunkCoords =
        this._getChunkCoordinatePositionFromScenePosition(sceneCenter);

    // Has the scene center moved to a new chunk?
    if (!areVec3sEqual(this._prevRenderSceneCenter, centerInChunkCoords)) {
      this._handleSceneMovedToNewChunk(sceneCenter, centerInChunkCoords);
    }
  }

  /**
   * Destroy and create new chunks according to the new scene position.
   *
   * @param {vec3} centerInSceneCoords
   * @param {vec3} centerInChunkCoords
   * @private
   */
  _handleSceneMovedToNewChunk(centerInSceneCoords, centerInChunkCoords) {
    // Get the difference from the new center to the old one.
    const diff = vec3.create();
    vec3.subtract(diff, centerInChunkCoords, this._prevRenderSceneCenter);

    const isDiffGreaterThanCountOnASide =
        diff[0] > this._chunkCountOnASide ||
        diff[1] > this._chunkCountOnASide ||
        diff[2] > this._chunkCountOnASide;

    // With really large differences, it's more efficient to just reset all chunks.
    if (isDiffGreaterThanCountOnASide) {
      this.reset(centerInSceneCoords);
    } else {
      this._updateChunksForNewCenter(diff);
    }

    vec3.copy(this._prevRenderSceneCenter, centerInChunkCoords);

    this._chunkListeners.forEach(listener => listener.onAllChunksUpdated());

    const positionString = vec3ToString(centerInChunkCoords);
    console.debug(`Entered new chunk: ${positionString}`);
  }

  /**
   * Creates and destroys chunks to update to the new center position.
   *
   * @param {vec3} centerDiff The difference from the old center to the new one, in chunk
   * coordinates.
   * @private
   */
  _updateChunksForNewCenter(centerDiff) {
    let xDiff = centerDiff[0];
    let yDiff = centerDiff[1];
    let zDiff = centerDiff[2];

    const chunkHalfCountOnASide = this._chunkCountOnASide / 2;

    let lowestXCoordinateToDelete = this._prevRenderSceneCenter[0] - chunkHalfCountOnASide;
    let lowestYCoordinateToDelete = this._prevRenderSceneCenter[1] - chunkHalfCountOnASide;
    let lowestZCoordinateToDelete = this._prevRenderSceneCenter[2] - chunkHalfCountOnASide;

    let lowestXCoordinateToAdd = this._prevRenderSceneCenter[0] + chunkHalfCountOnASide;
    let lowestYCoordinateToAdd = this._prevRenderSceneCenter[1] + chunkHalfCountOnASide;
    let lowestZCoordinateToAdd = this._prevRenderSceneCenter[2] + chunkHalfCountOnASide;

    if (xDiff < 0) {
      lowestXCoordinateToDelete += this._chunkCountOnASide + xDiff;
      lowestXCoordinateToAdd -= this._chunkCountOnASide - xDiff;
      xDiff = -xDiff;
    }
    if (yDiff < 0) {
      lowestYCoordinateToDelete += this._chunkCountOnASide + yDiff;
      lowestYCoordinateToAdd -= this._chunkCountOnASide - yDiff;
      yDiff = -yDiff;
    }
    if (zDiff < 0) {
      lowestZCoordinateToDelete += this._chunkCountOnASide + zDiff;
      lowestZCoordinateToAdd -= this._chunkCountOnASide - zDiff;
      zDiff = -zDiff;
    }

    //
    // Remove old chunks.
    //

    // Remove old chunks from the delta-x face (and from the x-y and x-z corners).
    for (let x = 0; x < xDiff; x++) {
      for (let y = 0; y < this._chunkCountOnASide; y++) {
        for (let z = 0; z < this._chunkCountOnASide; z++) {
          const chunk = this._getChunkFromPosition(
              x + lowestXCoordinateToDelete,
              y + lowestYCoordinateToDelete,
              z + lowestZCoordinateToDelete);
          if (chunk) {
            this._destroyChunk(chunk);
            this._chunks.delete(chunk.id);
          }
        }
      }
    }

    // Remove old chunks from the delta-y face (and from the y-z corner, but not from the x-y
    // corner).
    for (let x = xDiff; x < this._chunkCountOnASide; x++) {
      for (let y = 0; y < yDiff; y++) {
        for (let z = 0; z < this._chunkCountOnASide; z++) {
          const chunk = this._getChunkFromPosition(
              x + lowestXCoordinateToDelete,
              y + lowestYCoordinateToDelete,
              z + lowestZCoordinateToDelete);
          if (chunk) {
            this._destroyChunk(chunk);
            this._chunks.delete(chunk.id);
          }
        }
      }
    }

    // Remove old chunks from the delta-z face (but not from the x-z or y-z corners).
    for (let x = xDiff; x < this._chunkCountOnASide; x++) {
      for (let y = yDiff; y < this._chunkCountOnASide; y++) {
        for (let z = 0; z < zDiff; z++) {
          const chunk = this._getChunkFromPosition(
              x + lowestXCoordinateToDelete,
              y + lowestYCoordinateToDelete,
              z + lowestZCoordinateToDelete);
          if (chunk) {
            this._destroyChunk(chunk);
            this._chunks.delete(chunk.id);
          }
        }
      }
    }

    //
    // Add new chunks.
    //

    const chunkPosition = vec3.create();

    // Add new chunks to the delta-x face (and to the x-y and x-z corners).
    for (let x = 0; x < xDiff; x++) {
      for (let y = 0; y < this._chunkCountOnASide; y++) {
        for (let z = 0; z < this._chunkCountOnASide; z++) {
          vec3.set(chunkPosition,
              x + lowestXCoordinateToAdd,
              y + lowestYCoordinateToDelete,
              z + lowestZCoordinateToDelete);
          const chunk = this._createChunk(chunkPosition);
          this._chunks.set(chunk.id, chunk);
        }
      }
    }

    // Add new chunks to the delta-y face (and to the y-z corner, but not to the x-y corner).
    for (let x = xDiff; x < this._chunkCountOnASide; x++) {
      for (let y = 0; y < yDiff; y++) {
        for (let z = 0; z < this._chunkCountOnASide; z++) {
          vec3.set(chunkPosition,
              x + lowestXCoordinateToDelete,
              y + lowestYCoordinateToAdd,
              z + lowestZCoordinateToDelete);
          const chunk = this._createChunk(chunkPosition);
          this._chunks.set(chunk.id, chunk);
        }
      }
    }

    // Add new chunks to the delta-z face (but not to the x-z or y-z corners).
    for (let x = xDiff; x < this._chunkCountOnASide; x++) {
      for (let y = yDiff; y < this._chunkCountOnASide; y++) {
        for (let z = 0; z < zDiff; z++) {
          vec3.set(chunkPosition,
              x + lowestXCoordinateToDelete,
              y + lowestYCoordinateToDelete,
              z + lowestZCoordinateToAdd);
          const chunk = this._createChunk(chunkPosition);
          this._chunks.set(chunk.id, chunk);
        }
      }
    }
  }

  /**
   * @private
   */
  _destroyAllChunks() {
    this._chunks.forEach(chunk => this._destroyChunk(chunk));
    this._chunks.clear();
  }

  /**
   * Creates all chunks to fill the initial span of the global bounding box, which is calculated
   * from chunkCountOnASide.
   *
   * Assumes this._chunkCountOnASide is an even number.
   *
   * @private
   */
  _createAllChunks() {
    const chunkPosition = vec3.create();

    const lowestChuckOffsetFromCenter = -this._chunkCountOnASide / 2;
    const lowestChunkXCoordinate = this._prevRenderSceneCenter[0] + lowestChuckOffsetFromCenter;
    const lowestChunkYCoordinate = this._prevRenderSceneCenter[1] + lowestChuckOffsetFromCenter;
    const lowestChunkZCoordinate = this._prevRenderSceneCenter[2] + lowestChuckOffsetFromCenter;

    for (let x = 0; x < this._chunkCountOnASide; x++) {
      for (let y = 0; y < this._chunkCountOnASide; y++) {
        for (let z = 0; z < this._chunkCountOnASide; z++) {
          vec3.set(chunkPosition,
              lowestChunkXCoordinate + x,
              lowestChunkYCoordinate + y,
              lowestChunkZCoordinate + z);
          const chunk = this._createChunk(chunkPosition);
          this._chunks.set(chunk.id, chunk);
        }
      }
    }
  }

  /**
   * @param {vec3} chunkPosition The lowest corner of the chunk, in chunk coordinates.
   * @returns {Chunk}
   * @private
   */
  _createChunk(chunkPosition) {
    const centerInSceneCoords =
        this._getSceneCoordinateChunkCenterPositionFromChunkPosition(chunkPosition);
    const chunk = {
      id: ChunkController._getIdFromChunkPosition(
          chunkPosition[0], chunkPosition[1], chunkPosition[2]),
      bounds:
          Aabb.createAsUniformAroundCenter(centerInSceneCoords, this._chunkHalfSideLength)
    };
    this._chunkListeners.forEach(listener => listener.onChunkCreated(chunk));
    return chunk;
  }

  /**
   * @param {Chunk} chunk
   * @private
   */
  _destroyChunk(chunk) {
    this._chunkListeners.forEach(listener => listener.onChunkDestroyed(chunk));
  }

  /**
   * Translates the given the lowest-corner position of a chunk in chunk coordinates to the
   * center position of the chunk in scene coordinates.
   *
   * @param {vec3} chunkPosition
   * @returns {vec3}
   * @private
   */
  _getSceneCoordinateChunkCenterPositionFromChunkPosition(chunkPosition) {
    return vec3.fromValues(
        Math.floor(chunkPosition[0] * this._chunkSideLength + this._chunkHalfSideLength),
        Math.floor(chunkPosition[1] * this._chunkSideLength + this._chunkHalfSideLength),
        Math.floor(chunkPosition[2] * this._chunkSideLength + this._chunkHalfSideLength));
  }

  /**
   * Translates the given position from scene coordinates to chunk coordinates.
   *
   * @param {vec3} sceneCenter
   * @returns {vec3}
   * @private
   */
  _getChunkCoordinatePositionFromScenePosition(sceneCenter) {
    return vec3.fromValues(
        Math.floor(sceneCenter[0] / this._chunkSideLength),
        Math.floor(sceneCenter[1] / this._chunkSideLength),
        Math.floor(sceneCenter[2] / this._chunkSideLength));
  }

  /**
   * Translates the given scene-center position from scene coordinates to chunk coordinates, then
   * saves the chunk center.
   *
   * @param {vec3} sceneCenter
   * @private
   */
  _setChunkCoordinatePositionFromScenePosition(sceneCenter) {
    vec3.copy(this._prevRenderSceneCenter,
        this._getChunkCoordinatePositionFromScenePosition(sceneCenter));
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {?Chunk}
   * @private
   */
  _getChunkFromPosition(x, y, z) {
    return this._chunks.get(ChunkController._getIdFromChunkPosition(x, y, z));
  }

  /**
   * Two chunk positions with the same coordinates will always have the same ID.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {string}
   * @private
   */
  static _getIdFromChunkPosition(x, y, z) {
    return `${x},${y},${z}`;
  }
}

export {ChunkController};

/**
 * @typedef {Object} Chunk
 * @property {string} id
 * @property {Aabb} bounds
 */

/**
 * @typedef {Object} ChunkListener
 * @property {Function} onChunkCreated An event handler that is called upon the creation of each
 * individual new chunk.
 * @property {Function} onChunkDestroyed An event handler that is called upon the destruction of
 * each individual.
 * @property {Function} onAllChunksUpdated An event handler that is called after all chunks have been
 * created and destroyed for a given chunk positioning update.
 */
