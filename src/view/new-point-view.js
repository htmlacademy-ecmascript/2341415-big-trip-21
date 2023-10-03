import {POINT_TYPES, FORM_DATE_FORMAT} from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {extractPointParams, typeToCebabCase} from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { MIN_PRICE, MAX_PRICE } from '../const.js';

function createPointTypeTemplate(type, checked = false) {

  const typeLc = type.toLowerCase();

  return `<div class="event__type-item">
  <input id="event-type-${typeLc}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeLc}" ${checked ? 'checked' : ''}>
  <label class="event__type-label  event__type-label--${typeLc}" for="event-type-${typeLc}-1">${type}</label>
  </div>`;
}

function createOfferTemplate({ title, price, id }, selectedOfferIds) {
  const cebabCaseTitle = title.split(' ').map((word) => word.toLowerCase()).join('-');
  const elementId = `event-offer-${cebabCaseTitle}-1`;
  return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="${elementId}" type="checkbox" name="event-offer-${cebabCaseTitle}" ${selectedOfferIds.includes(id) ? 'checked' : ''} value="${id}">
  <label class="event__offer-label" for="${elementId}">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </label>
</div>`;
}

function createOffersSectionTemplate(offers, selectedOfferIds) {
  return offers
    ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${offers?.map((offer) => createOfferTemplate(offer, selectedOfferIds))}
      </div>
    </section>`
    : '';
}

function createDestinationSectionTemplate(destination) {
  if (!destination) {
    return '';
  }

  const { name, description, pictures } = destination;

  return ` <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${name} ${description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures.map(createDestinationPhotosTemplate)}
      </div>
    </div>
  </section>`;
}

function createDestinationPhotosTemplate (pictures){
  return `<img class="event__photo" src="${pictures.src}">`;
}

function createPointEditTemplate(state, cities) {
  const { type, offers, selectedOfferIds, destination } = state;
  const typeImgPath = `img/icons/${typeToCebabCase(type)}.png`;
  const city = destination?.name;

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="${typeImgPath}" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${Object.values(POINT_TYPES).map((pointType) => createPointTypeTemplate(pointType, pointType === type)).join('')}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="ice-cream-choice">${type}</label>
        <input class="event__input  event__input--destination" list="event-destination-list-1" id="event-destination-1" name="event-destination-1" type="text" ${!city ? 'placeholder="введите название города"' : ''} ${city ? `value=${city}` : ''}>
        <datalist id="event-destination-list-1">
        ${cities.map((cityName) => `<option value="${cityName}"></option>`)}
        </datalist>
      </div>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input type="number" class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" min="${MIN_PRICE}" max="${MAX_PRICE}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
    ${createOffersSectionTemplate(offers, selectedOfferIds)}

    ${createDestinationSectionTemplate(destination)}
  </form>
</li>`;

}

export default class NewPointView extends AbstractStatefulView {

  #handleFormSubmit = null;
  #handlerFormEsc = null;
  #handleFormCancel = null;
  #offersMap = null;
  #destinationsMap = null;
  #datepicker = null;

  constructor({offersMap, destinations}, listeners) {
    super();
    const {onFormSubmit, onEsc, onCancel} = listeners;
    this.point = {};
    this.#offersMap = offersMap;
    this.#destinationsMap = new Map(destinations.map((destination) => [destination.name, destination]));
    this.#handleFormSubmit = onFormSubmit;
    this.#handlerFormEsc = onEsc;
    this.#handleFormCancel = onCancel;
    const defaultType = POINT_TYPES.bus.toLowerCase();
    this._setState({
      type: defaultType,
      selectedOfferIds: [],
      offers: this.#offersMap.get(defaultType)
    });
    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state, [...this.#destinationsMap.keys()]);
  }

  close() {
    document.removeEventListener('keydown', this.#formEscHandler);
    this.element.remove();
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  _restoreHandlers() {
    const form = this.element.querySelector('form');
    const canceler = this.element.querySelector('.event__reset-btn');
    form.addEventListener('submit', this.#formSubmitHandler);
    document.addEventListener('keydown', this.#formEscHandler);
    canceler.addEventListener('click', this.#formCancelHandler);

    const eventTypeGroup = form.querySelector('.event__type-group');

    eventTypeGroup.addEventListener('change',(evt) => {
      const newType = evt.target.value;
      this.updateElement({
        type: newType,
        offers: this.#offersMap.get(newType),
        selectedOfferIds: [],
      });
    });

    const offersContainer = this.element.querySelector('.event__available-offers');

    if (offersContainer) {
      offersContainer.addEventListener('change', (evt) => {
        const offerId = evt.target.value;

        const selectedOfferIds = evt.target.checked
          ? [...this._state.selectedOfferIds, offerId]
          : this._state.selectedOfferIds.filter((selectedOfferId) => selectedOfferId !== offerId);

        this.updateElement({ selectedOfferIds });
      });
    }

    const eventDestination = form.querySelector('.event__input--destination');

    eventDestination.addEventListener('change', (evt) => {
      const cityName = evt.target.value;
      this.updateElement({
        destination: this.#destinationsMap.get(cityName),
      });
    });

    this.setDateFromPicker();
    this.setDateToPicker();
  }

  #getPointParams(formData) {
    return extractPointParams(formData, this._state);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    const poiintParams = this.#getPointParams(formData);
    this.#handleFormSubmit(poiintParams);
  };

  #formCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormCancel();
  };

  #formEscHandler = (evt) => {
    if (evt.code === 'Escape') {
      evt.preventDefault();
      this.#handlerFormEsc();
    }
  };

  setDateFromPicker() {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: FORM_DATE_FORMAT,
        defaultDate: this._state.dateFrom,
      },
    );
  }

  setDateToPicker() {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: FORM_DATE_FORMAT,
        defaultDate: this._state.dateTo,
      },
    );
  }
}
