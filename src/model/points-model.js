import { FILTERTYPE } from '../const.js';
import { sortPrice, sortTime, sortDay, isExpired, isAfterToday, getRequestParamsFrom } from '../utils.js';
import { SORT_TYPE } from '../const.js';
import PointsApi from '../backend-api/points-api.js';
import OffersApi from '../backend-api/offers-api.js';
import DestinationsApi from '../backend-api/destination-api.js';

export default class PointsModel {
  #selectedFilter = null;
  #sortBy = SORT_TYPE.DAY;

  #subscribers = [];

  #pastPoints = [];
  #futurePoints = [];
  #todayPoints = [];

  #pointsMap = null;
  destinationsMap = null;
  offersMap = null;

  #pointsApi = new PointsApi();
  #destinationsApi = new DestinationsApi();
  #offersApi = new OffersApi();

  init() {
    return Promise.all([
      this.#pointsApi.getList(),
      this.#destinationsApi.getList(),
      this.#offersApi.getList(),
    ]).catch(() => [[], [], []])
      .then(([points, destinations, offers]) => {
        this.#pointsMap = new Map(points.map((point) => [point.id, point]));
        this.destinationsMap = new Map(destinations.map((destination) => [destination.id, destination]));
        this.offersMap = new Map(offers.map((offer) => [offer.type, offer.offers]));
        this.#segregatePointsByDate();
      }).then(() => this);
  }

  get #points() {
    return [...this.#pointsMap.values()];
  }

  get events() {
    return this.#sortedPoints.map((point) => this.getEventOf(point));
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

  setFilter(filterType) {
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

  get destinations() {
    return [...this.destinationsMap.values()];
  }

  get points() {
    return this.#sortedPoints;
  }

  subscribe(fn) {
    this.#subscribers.push(fn);
  }

  getPoint(id) {
    return this.#pointsMap.get(id);
  }

  getEvent(pointId) {
    const point = this.#pointsMap.get(pointId);

    return this.getEventOf(point);
  }

  getEventOf(point) {
    const destination = this.destinationsMap.get(point.destination);
    const offers = this.offersMap.get(point.type);

    return { point, destination, offers };
  }

  switchPointIsFavorite(id) {
    const point = this.getPoint(id);
    const pointParams = { ...getRequestParamsFrom(point), 'is_favorite': !point.isFavorite };
    this.updatePoint(pointParams);
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

  addPoint(pointParams) {
    return this.#pointsApi
      .addPoint(pointParams)
      .then((newPointParams) => this.#setPoint(newPointParams));
  }

  deletePoint(id) {
    return this.#pointsApi
      .deletePoint(id)
      .then(() => {
        this.#pointsMap.delete(id);
        this.#notify();
      });
  }

  updatePoint(pointUpdateParams) {
    return this.#pointsApi
      .updatePoint(pointUpdateParams)
      .then((newPointParams) => this.#setPoint(newPointParams));
  }

  #notify () {
    this.#subscribers.forEach((fn) => fn(this.events));
  }

  #setPoint(point) {
    this.#pointsMap.set(point.id, point);
    this.#notify();
  }

  #segregatePointsByDate() {
    for (const point of this.#points) {
      if (isExpired(point.dateTo)) {
        this.#pastPoints.push(point);
      } else if(isAfterToday(point.dateFrom)) {
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
