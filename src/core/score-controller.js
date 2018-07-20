const POINTS_FOR_ASTEROID = 100;

class ScoreController {
  /**
   * @param {HTMLElement} scorePanel
   */
  constructor(scorePanel) {
    this._scorePanel = scorePanel;
    this._score = 0;
    this._updateScorePanel();
    this._bestScore = window.localStorage.getItem('best-score') || 0;
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

  /**
   * @returns {number}
   */
  get bestScore() {
    return this._bestScore;
  }

  /**
   * Updates the best score with the current score, if the current score is higher.
   *
   * @returns {boolean} True if the current score was higher.
   */
  updateBestScore() {
    if (this._score > this._bestScore) {
      this._bestScore = this._score;
      window.localStorage.setItem('best-score', this._score);
      return true;
    } else {
      return false;
    }
  }
}

export { ScoreController };
