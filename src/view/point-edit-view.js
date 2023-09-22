import {POINT_TYPES, POINT_TYPE_OFFERS, CITIES} from '../const.js';
import { format } from 'date-fns';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createPointTypeTemplate(type, checked = false) {

  const typeLc = type.toLowerCase();

  return `<div class="event__type-item">
  <input id="event-type-${typeLc}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeLc}" ${checked ? 'checked' : ''}>
  <label class="event__type-label  event__type-label--${typeLc}" for="event-type-${typeLc}-1">${type}</label>
  </div>`;
}

function createOffersTemplate({ title, price, id }, selectedOfferIds) {
  const cebabCaseTitle = title.split(' ').map((it) => it.toLowerCase()).join('-');
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

function createDestinationPhotosTemplate (pictures){
  return `<img class="event__photo" src="${pictures.src}">`;
}

function createPointEditTemplate({ point, destination, offers: pointOffers, selectedOfferIds = [] }, state, cityDescriptions) {
  const { dateFrom, dateTo, basePrice } = point;
  const type = state.type ?? point.type;
  const offers = state.offers ?? pointOffers;
  const typeImgPath = type.toLowerCase();
  const city = state.city ?? destination.city;
  const {pictures, description} = cityDescriptions.find((it) => it.city === city);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${typeImgPath}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${Object.values(POINT_TYPES).map((it) => createPointTypeTemplate(it, it === type)).join('')}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="ice-cream-choice">${type}</label>
        <input class="event__input  event__input--destination" id="event-destination-1" list="event-destination-list-1" id="event-destination-1" name="event-destination-1" type="text" value=${city}>
        <datalist id="event-destination-list-1">
        ${CITIES.map((cityName) => `<option value="${cityName}"></option>`)}
        </datalist>
      </div>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${format(dateFrom, 'dd/MM/yy HH:mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${format(dateTo, 'dd/MM/yy HH:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${offers.map((it) => createOffersTemplate(it, selectedOfferIds))}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${city} ${description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${pictures.map(createDestinationPhotosTemplate)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`;

}

export default class PointEditView extends AbstractStatefulView {

  #handleFormSubmit = null;
  #handlerFormEsc = null;
  #handleFormCancel = null;
  #formData = null;
  #cityDescriptions = null;
  #datepicker = null;

  constructor({point, cityDescriptions}, listeners) {
    super();
    const {onFormSubmit, onEsc, onCancel} = listeners;
    this.point = point;
    this.#cityDescriptions = cityDescriptions;
    this.#handleFormSubmit = onFormSubmit;
    this.#handlerFormEsc = onEsc;
    this.#handleFormCancel = onCancel;
    this._restoreHandlers();

  }

  get template() {
    return createPointEditTemplate(this.point, this._state, this.#cityDescriptions);
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
    const submitter = this.element.querySelector('.event__save-btn');
    const canceler = this.element.querySelector('.event__reset-btn');
    this.#formData = new FormData(form, submitter);
    form.addEventListener('submit', this.#formSubmitHandler);
    document.addEventListener('keydown', this.#formEscHandler);
    canceler.addEventListener('click', this.#formCancelHandler);
    const eventTypeGroup = form.querySelector('.event__type-group');
    eventTypeGroup.addEventListener('change',(evt) => {
      this.updateElement({
        type: evt.target.value,
        offers: POINT_TYPE_OFFERS[evt.target.value]
      });
    });
    const offersContainer = this.element.querySelector('.event__available-offers');
    offersContainer.addEventListener('change', (evt) => {
      evt.preventDefault();
    });

    const eventDestination = form.querySelector('.event__input--destination');
    eventDestination.addEventListener('change', (evt) => {
      this.updateElement({
        city: evt.target.value,
      });
    });
    this.setDateFromPicker();
    this.setDateToPicker();
  }

  #dateFromChangeHandler = ([dateFrom]) => {
    this.updateElement({
      dateFrom,
    });
  };

  #dateToChangeHandler = ([dateTo]) => {
    this.updateElement({
      dateTo,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#formData);
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
        dateFormat: 'j F',
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
  }

  setDateToPicker() {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'j F',
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      },
    );
  }
}
