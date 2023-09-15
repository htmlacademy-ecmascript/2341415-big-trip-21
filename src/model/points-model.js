import { FILTERTYPE } from '../const.js';
import { sortPrice, sortTime, sortDay, isExpired, isAfterToday } from '../utils.js';
import { SORT_TYPE } from '../const.js';

export default class PointsModel {
  #selectedFilter = null;
  #points;
  #pastPoints = [];
  #futurePoints = [];
  #todayPoints = [];
  #subscribers = [];
  #sortBy = SORT_TYPE.DAY;

  constructor({ points }) {
    this.#points = points;
    this.#segregatePointsByDate();
  }

  get filterTypes() {
    return Object.keys(FILTERTYPE);
  }

  setSorting(sortBy) {
    if (sortBy) {
      this.#sortBy = sortBy;
      this.#notify();
    }
  }

  selectFilter(filterType) {
    this.#selectedFilter = filterType;
    this.#sortBy = SORT_TYPE.DAY;
    this.#notify();
  }

  get sortType() {
    return this.#sortBy;
  }

  get availableFilterTypes() {
    const result = [FILTERTYPE.EVERYTHING];

    if(this.#pastPoints.length) {
      result.push(FILTERTYPE.PAST);
    }

    if(this.#futurePoints.length) {
      result.push(FILTERTYPE.FUTURE);
    }

    if(this.#todayPoints.length) {
      result.push(FILTERTYPE.PRESENT);
    }

    return result;
  }

  get points() {
    return this.#sortedPoints;
  }

  subscribe(fn) {
    this.#subscribers.push(fn);
  }

  getPoint(id) {
    return this.#points.find((it) => it.point.id === id);
  }

  switchPointIsFavorite(id) {
    const point = this.getPoint(id);
    point.point.isFavorite = !point.point.isFavorite;
  }

  get #filtredPoints() {
    if(this.#selectedFilter === FILTERTYPE.PAST) {
      return this.#pastPoints;
    }
    if(this.#selectedFilter === FILTERTYPE.FUTURE) {
      return this.#futurePoints;
    }
    if(this.#selectedFilter === FILTERTYPE.PRESENT) {
      return this.#todayPoints;
    }
    return this.#points;
  }

  #notify () {
    this.#subscribers.forEach((fn) => fn(this.points));
  }

  #segregatePointsByDate() {
    for (const point of this.#points) {
      if (isExpired(point.point.dateTo)) {
        this.#pastPoints.push(point);
      } else if(isAfterToday(point.point.dateFrom)) {
        this.#futurePoints.push(point);
      } else {
        this.#todayPoints.push(point);
      }
    }
  }

  get #sorter() {
    switch (this.#sortBy) {
      case SORT_TYPE.TIME: return sortTime;
      case SORT_TYPE.PRICE: return sortPrice;
      case SORT_TYPE.DAY: return sortDay;
      default: return (list) => list;
    }
  }

  get #sortedPoints() {
    return [...this.#filtredPoints].sort(this.#sorter);
  }
}
