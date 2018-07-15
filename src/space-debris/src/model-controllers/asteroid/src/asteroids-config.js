/**
 * This module handles configuration parameters relating to the asteroids model.
 */

const asteroidsConfig = {};

asteroidsConfig.shaderProgram = 'general-model-program';
asteroidsConfig.texturePath = 'images/textures/astronomical/rhea.png';
asteroidsConfig.initialAsteroidCount = 17;

asteroidsConfig._initialAsteroidMinDistanceFromShip = 100;
asteroidsConfig._initialAsteroidMaxDistanceFromShip = 400;
asteroidsConfig.minDistanceFromShip = 150;
asteroidsConfig.maxDistanceFromShip = 460;

// FIXME: Add params back, and check all these

// Scene coordinates per millisecond.
asteroidsConfig._initialMinSpeed = 0.1;
asteroidsConfig._initialMaxSpeed = 0.2;
asteroidsConfig.minSpeed = 0.25;
asteroidsConfig.maxSpeed = 0.45;

asteroidsConfig.minScale = 38;
asteroidsConfig.maxScale = 78;

asteroidsConfig.minDivisionsCount = 2;
asteroidsConfig.maxDivisionsCount = 5;

asteroidsConfig.minVertexOrthogonalDeviation = -0.2;
asteroidsConfig.maxVertexOrthogonalDeviation = 0.2;

// Radians per millisecond.
const _oneRevolutionPerSecond = Math.PI / 500;
asteroidsConfig.minRotationRate = _oneRevolutionPerSecond * 0.001;
asteroidsConfig.maxRotationRate = _oneRevolutionPerSecond * 0.2;

asteroidsConfig.minInterceptVelocityDeviationAngle = 0;
asteroidsConfig.maxInterceptVelocityDeviationAngle = Math.PI * 0.04;

asteroidsConfig.density = 0.000003;

asteroidsConfig.positionMaxAngleFromShipTrajectory = Math.PI * 0.25;

asteroidsConfig.minAsteroidCount = 10;
asteroidsConfig.maxAsteroidCount = 40;

// New asteroids spawn at a rate that is inversely proportional to the ship's speed. This defines
// that ratio.
asteroidsConfig._spawnPeriodShipSpeedMultiplier = 50;

// Should probably try to keep this in-sync with sceneConfig.chunkSideLength.
asteroidsConfig.removalDistance = 600;

asteroidsConfig._removalCheckThrottleDelay = 300;
asteroidsConfig._removalSquaredDistance = null;

function _updateRemovalSquaredDistance() {
  asteroidsConfig._removalSquaredDistance =
      asteroidsConfig.removalDistance * asteroidsConfig.removalDistance;
}

_updateRemovalSquaredDistance();

const asteroidsFolderConfig = {
  label: 'Asteroids',
  config: asteroidsConfig,
  isOpen: false,
  onChangeListeners: {
    'removalDistance': _updateRemovalSquaredDistance,
  },
};

export {asteroidsConfig, asteroidsFolderConfig};
