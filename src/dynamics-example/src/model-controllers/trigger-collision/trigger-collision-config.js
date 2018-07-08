/**
 * This module handles configuration parameters relating to simulations that collide two objects.
 */

const triggerCollisionConfig = {};

triggerCollisionConfig.distance = {
  start: 50,
  min: 0,
  max: 200
};
triggerCollisionConfig.speed = {
  start: 0.02,
  min: 0,
  max: 1
};
triggerCollisionConfig.triggerCollision = () => {};

const object1Config = {};

object1Config.shape = {
  start: 'CAPSULE',
  options: [
    'CUBE',
    'ICOSAHEDRON',
    'ICOSPHERE',
    'LAT_LONG_SPHERE',
    'CAPSULE',
    'TETRAHEDRON',
    'RANDOM'
  ]
};
object1Config.rotation = {
  start: vec3.fromValues(0, 0, 0),
  min: vec3.fromValues(-Math.PI, -Math.PI, -Math.PI),
  max: vec3.fromValues(Math.PI, Math.PI, Math.PI)
};
object1Config.displacement = {
  start: vec3.fromValues(0, 0, 0),
  min: vec3.fromValues(-50, -50, -50),
  max: vec3.fromValues(50, 50, 50)
};
object1Config.mass = {
  start: 1,
  min: 0.1,
  max: 50
};

const object2Config = {};

object2Config.shape = {
  start: 'CAPSULE',
  options: [
    'CUBE',
    'ICOSAHEDRON',
    'ICOSPHERE',
    'LAT_LONG_SPHERE',
    'CAPSULE',
    'TETRAHEDRON',
    'RANDOM'
  ]
};
object2Config.rotation = {
  start: vec3.fromValues(0, 0, 0),
  min: vec3.fromValues(-Math.PI, -Math.PI, -Math.PI),
  max: vec3.fromValues(Math.PI, Math.PI, Math.PI)
};
object2Config.displacement = {
  start: vec3.fromValues(0, 0, 0.9),
  min: vec3.fromValues(-50, -50, -50),
  max: vec3.fromValues(50, 50, 50)
};
object2Config.mass = {
  start: 2,
  min: 0.1,
  max: 50
};

const object1FolderConfig = {
  label: 'Object 1',
  config: object1Config,
  isOpen: true
};

const object2FolderConfig = {
  label: 'Object 2',
  config: object2Config,
  isOpen: true
};

const triggerCollisionFolderConfig = {
  label: 'Collision Simulation',
  config: triggerCollisionConfig,
  isOpen: true,
  childFolders: [
    object1FolderConfig,
    object2FolderConfig
  ]
};

export {triggerCollisionConfig, object1Config, object2Config, triggerCollisionFolderConfig};
