/**
 * This module defines a collection of static geometry utility functions.
 */

/**
 * Calculates the velocity needed for an object from sourcePosition moving with sourceSpeed to
 * intercept with an object moving from targetPosition with targetVelocity.
 *
 * The resulting velocity is assigned to the given interceptVelocity output parameter.
 *
 * If sourceSpeed is not fast enough to intercept the target, then interceptVelocity will be
 * assigned a value parallel to targetVelocity.
 *
 * @param {vec3} interceptVelocity (Output parameter)
 * @param {vec3} sourcePosition
 * @param {number} sourceSpeed
 * @param {vec3} targetPosition
 * @param {vec3} targetVelocity
 * @returns {boolean} True if sourceSpeed was fast enough to intercept the target.
 */
function calculateInterceptVelocity(interceptVelocity, sourcePosition, sourceSpeed, targetPosition,
                                    targetVelocity) {
  // Calculate the direction from the source to the target.
  const directionToTarget = vec3.create();
  vec3.subtract(directionToTarget, targetPosition, sourcePosition);
  vec3.normalize(directionToTarget, directionToTarget);

  // Decompose the target's velocity into two parts:
  // - the part parallel to directionToTarget,
  // - the part orthogonal to directionToTarget.

  // The parallel component.
  const targetVelocityParallelComponent = vec3.create();
  const parallelComponentScale = vec3.dot(targetVelocity, directionToTarget);
  vec3.scale(targetVelocityParallelComponent, directionToTarget, parallelComponentScale);

  // The orthogonal component.
  const targetVelocityOrthogonalComponent = vec3.create();
  vec3.subtract(targetVelocityOrthogonalComponent, targetVelocity, targetVelocityParallelComponent);

  const orthogonalSpeed = vec3.length(targetVelocityOrthogonalComponent);

  const isSourceFastEnoughToInterceptTarget = orthogonalSpeed < sourceSpeed;

  if (!isSourceFastEnoughToInterceptTarget) {
    // Since source is not fast enough to intercept the target, give it a velocity that is parallel
    // to targetVelocity.
    vec3.normalize(interceptVelocity, targetVelocity);
    vec3.scale(interceptVelocity, interceptVelocity, sourceSpeed);
  } else {
    const parallelSpeed = Math.sqrt(sourceSpeed * sourceSpeed - orthogonalSpeed * orthogonalSpeed);
    const sourceVelocityParallelComponent = vec3.create();
    vec3.scale(sourceVelocityParallelComponent, directionToTarget, parallelSpeed);
    vec3.add(interceptVelocity, sourceVelocityParallelComponent, targetVelocityOrthogonalComponent);
  }

  return isSourceFastEnoughToInterceptTarget;
}

export {
  calculateInterceptVelocity,
};
