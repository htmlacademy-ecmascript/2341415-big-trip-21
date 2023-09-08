import { differenceInDays } from 'date-fns';
import { FILTERTYPE } from '../const.js';

function isExpired(dueDate) {
  return differenceInDays(new Date(), dueDate) > 0;
}

function isAfterToday(dueDate) {
  return differenceInDays(dueDate, new Date()) > 0;
}

export default class FiltersController {
  #selectedFilter = null;
  #points;
  #pastPoints = [];
  #futurePoints = [];
  #todayPoints = [];
  #subscribers = [];

  constructor({ points }) {
    this.#points = points;
    this.#segregatePointsByDate();
  }

  get filterTypes() {
    return Object.keys(FILTERTYPE);
  }

  selectFilter(filterType) {
    this.#selectedFilter = filterType;
    this.#notify();
  }

  get availableFilterTypes() {
    const result = [FILTERTYPE.EVERYTHING];

    if(this.#pastPoints.length > 0) {
      result.push(FILTERTYPE.PAST);
    }

    if(this.#futurePoints.length > 0) {
      result.push(FILTERTYPE.FUTURE);
    }

    if(this.#todayPoints.length > 0) {
      result.push(FILTERTYPE.PRESENT);
    }

    return result;
  }

  subscribe(fn) {
    this.#subscribers.push(fn);
  }

  get filtredPoints() {
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
    this.#subscribers.forEach((fn) => fn(this.filtredPoints));
  }

  #segregatePointsByDate() {
    for (const it of this.#points) {
      if (isExpired(it.point.dateTo)) {
        this.#pastPoints.push(it);
      } else if(isAfterToday(it.point.dateFrom)) {
        this.#futurePoints.push(it);
      } else {
        this.#todayPoints.push(it);
      }
    }
  }
}
