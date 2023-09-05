import { format, differenceInCalendarDays, differenceInHours, differenceInMinutes, formatDuration } from 'date-fns';
import { humanizePointDueDate } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';
import { hide, show } from '../utils.js';
import { DURATION } from '../const.js';

function getDurationString(from, to) {
  const days = differenceInCalendarDays(to, from);
  const hours = differenceInHours(to, from);

  const formated = formatDuration(
    {
      days,
      hours: differenceInHours(to, from) - DURATION.hoursInDay * days,
      minutes: differenceInMinutes(to, from) - hours * DURATION.minInHour,
    },
    {
      format: ['days', 'hours', 'minutes'],
      delimiter: ' '
    }
  );

  return formated
    .replace(' days', 'D')
    .replace(' day', 'D')
    .replace(' hours', 'H')
    .replace(' hour', 'H')
    .replace(' minutes', 'M')
    .replace(' minute', 'M');
}

function createOfferTemplate({ title, price, }) {
  return `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`;
}

function createPointTemplate({ point, destination, offers, selectedOfferIds = [offers.at(0).id]}) {

  const selectedOffers = offers.filter((it) => selectedOfferIds.includes(it.id));
  const { dateFrom, dateTo, type, basePrice } = point;
  const typeImgPath = type.toLowerCase();

  const { city } = destination;

  const date = humanizePointDueDate(dateFrom);

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="2019-03-18">${date}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${typeImgPath}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${city}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T10:30">${format(dateFrom, 'HH:mm')}</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T11:00">${format(dateTo, 'HH:mm')}</time>
      </p>
      <p class="event__duration">${getDurationString(dateFrom, dateTo)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">${selectedOffers.map(createOfferTemplate).join('')}</ul>
    <button class="event__favorite-btn event__favorite-btn--active" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>

<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="2019-03-18">${date}/time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/flight.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} Chamonix</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T12:25">12:25</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T13:35">13:35</time>
      </p>
      <p class="event__duration">01H 10M</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">160</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">${offers.map(createOfferTemplate).join('')}</ul>
    <button class="event__favorite-btn" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
}

export default class PointView extends AbstractView {
  #handleEditClick = null;
  constructor(pointModel, listeners){
    const { onEditClick } = listeners;
    super();
    this.point = pointModel;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createPointTemplate(this.point);
  }

  hide() {
    hide(this.element.querySelector('.event'));
  }

  show() {
    show(this.element.querySelector('.event'));
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick(this);
  };
}
