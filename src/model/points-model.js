export default class PointsModel {
  #points;

  constructor({ points }) {
    this.#points = points;
  }

  get() {
    return this.#points;
  }
}
