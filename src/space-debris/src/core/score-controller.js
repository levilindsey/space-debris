const POINTS_FOR_ASTEROID = 100;

class ScoreController {
  /**
   * @param {HTMLElement} scorePanel
   */
  constructor(scorePanel) {
    this._scorePanel = scorePanel;
    this._score = 0;
    this._updateScorePanel();
  }

  onAsteroidShot() {
    this._score += POINTS_FOR_ASTEROID;
    this._updateScorePanel();
  }

  _updateScorePanel() {
    this._scorePanel.textContent = this._score;
  }

  /**
   * @returns {number}
   */
  get score() {
    return this._score;
  }
}

export { ScoreController };
