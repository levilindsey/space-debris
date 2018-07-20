import { createHslColorString } from 'gamex';

const INITIAL_HEALTH_COUNT = 3;
const HUE_EMPTY = 0.0;
const HUE_FULL = 0.33;
const SATURATION = 0.94;
const LIGHTNESS = 0.50;
const ALPHA = 0.8;

class HealthController {
  /**
   * @param {HTMLElement} healthMeter
   * @param {Function} onHealthDepleted
   */
  constructor(healthMeter, onHealthDepleted) {
    this._healthMeter = healthMeter;
    this._onHealthDepleted = onHealthDepleted;
    this._capacityWidth = this._healthMeter.offsetWidth;
    this._healthCount = INITIAL_HEALTH_COUNT;
    this._updateHealthMeter(1);
  }

  /**
   * @returns {number} The ratio of the current health to the original health capacity.
   */
  decrement() {
    this._healthCount--;
    const ratio = this._healthCount * 1.0 / INITIAL_HEALTH_COUNT;
    this._updateHealthMeter(ratio);

    if (this._healthCount <= 0) {
      this._onHealthDepleted();
    }

    return ratio;
  }

  /**
   * @param {number} ratio From 0 to 1.
   */
  _updateHealthMeter(ratio) {
    this._healthMeter.style.width = `${ratio * this._capacityWidth}px`;
    this._healthMeter.style.backgroundColor = createHslColorString({
      h: HUE_EMPTY + (HUE_FULL - HUE_EMPTY) * ratio,
      s: SATURATION,
      l: LIGHTNESS,
      a: ALPHA,
    });
  }
}

export { HealthController };
