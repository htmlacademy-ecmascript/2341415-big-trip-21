import {POINT_TYPES} from '../const.js';
import { format } from 'date-fns';
import AbstractView from '../framework/view/abstract-view.js';

function createPointTypeTemplate(type, checked = false) {

  const typeLc = type.toLowerCase();

  return `<div class="event__type-item">
  <input id="event-type-${typeLc}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeLc}" ${checked ? 'checked' : ''}>
  <label class="event__type-label  event__type-label--${typeLc}" for="event-type-${typeLc}-1">${type}</label>
  </div>`;
}

function createOffersTemplate({ title, price, id }, selectedOfferIds) {
  return `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${selectedOfferIds.includes(id) ? 'checked' : ''}>
  <label class="event__offer-label" for="event-offer-luggage-1">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </label>
</div>`;
}

function createDestinationPhotosTemplate (pictures){
  return `<img class="event__photo" src="${pictures.src}">`;
}

function createPointEditTemplate({ point, destination, offers, selectedOfferIds = [offers.at(0).id] }) {
  const { dateFrom, dateTo, type, basePrice } = point;
  const typeImgPath = type.toLowerCase();
  const {pictures, city} = destination;

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
            ${POINT_TYPES.map((it) => createPointTypeTemplate(it, it === type)).join('')}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
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
        <p class="event__destination-description">${destination.city} ${destination.description}</p>

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

export default class PointEditView extends AbstractView {

  #handleFormSubmit = null;
  #handlerFormEsc = null;
  #handleFormCancel = null;
  #formData = null;

  constructor(options, listeners) {
    super();
    const {onFormSubmit, onEsc, onCancel} = listeners;
    this.options = options;
    this.#handleFormSubmit = onFormSubmit;
    this.#handlerFormEsc = onEsc;
    this.#handleFormCancel = onCancel;

    const form = this.element.querySelector('form');
    const submitter = this.element.querySelector('.event__save-btn');
    const canceler = this.element.querySelector('.event__reset-btn');
    this.#formData = new FormData(form, submitter);
    form.addEventListener('submit', this.#formSubmitHandler);
    document.addEventListener('keydown', this.#formEscHandler);
    canceler.addEventListener('click', this.#formCancelHandler);
  }

  get template() {
    return createPointEditTemplate(this.options);
  }

  close() {
    document.removeEventListener('keydown', this.#formEscHandler);
    this.element.remove();
  }

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
}
