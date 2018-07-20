import {calculateInterceptVelocity} from '../src/geometry';
import {checkVec3} from '../testing/testing-utils';

describe('geometry', () => {
  describe('calculateInterceptVelocity', () => {
    it('can intercept', () => {
      const interceptVelocity = vec3.create();
      const sourcePosition = vec3.fromValues(10, 0, 0);
      const sourceSpeed = 10;
      const targetPosition = vec3.fromValues(0, 10, 0);
      const targetVelocity = vec3.fromValues(0, -10, 0);
      calculateInterceptVelocity(interceptVelocity, sourcePosition, sourceSpeed,
          targetPosition, targetVelocity);
      const expectedInterceptVelocity = vec3.fromValues(-10, 0, 0);
      checkVec3(interceptVelocity, expectedInterceptVelocity);
    });

    it('moving too fast to intercept', () => {
      const interceptVelocity = vec3.create();
      const sourcePosition = vec3.fromValues(10, 0, 0);
      const sourceSpeed = 10;
      const targetPosition = vec3.fromValues(0, 10, 0);
      const targetVelocity = vec3.fromValues(0, -50, 0);
      calculateInterceptVelocity(interceptVelocity, sourcePosition, sourceSpeed,
          targetPosition, targetVelocity);
      const expectedInterceptVelocity = vec3.fromValues(0, -10, 0);
      checkVec3(interceptVelocity, expectedInterceptVelocity);
    });
  });
});
