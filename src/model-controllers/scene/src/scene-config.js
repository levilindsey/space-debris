import {cameraConfig} from '../../../config';

/**
 * This module handles configuration parameters relating to the overall scene.
 */

const sceneConfig = {};

// Should probably try to keep this in-sync with asteroidsConfig.removalDistance.
sceneConfig.chunkSideLength = 700;
sceneConfig.chunkCountOnASide = 8;

// Keep this value correlated with cameraConfig.zFar and star-shader.MAX_DISTANCE_FROM_CAMERA.
sceneConfig.renderDistance = sceneConfig.chunkSideLength * (sceneConfig.chunkCountOnASide - 1) / 2;
cameraConfig.zFar = sceneConfig.renderDistance;

export {sceneConfig};
