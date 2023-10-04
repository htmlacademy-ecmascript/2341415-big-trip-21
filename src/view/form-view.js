import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

export default class FormView extends AbstractStatefulView {

  #handlerFormEsc = null;
  #destinationsMap = null;
  #datepicker = null;

  constructor({ destinations }, listeners) {
    super();
    const {onEsc} = listeners;
    this.#destinationsMap = new Map(destinations.map((destination) => [destination.name, destination]));
    this.#handlerFormEsc = onEsc;
    const cities = [...this.#destinationsMap.keys()];

    this._setState({
      cities,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  }

  _setCommonHandlers() {
    document.addEventListener('keydown', this._formEscHandler);
  }

  close() {
    document.removeEventListener('keydown', this._formEscHandler);
    this.element.remove();
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  setSaving() {
    this.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setDeleting() {
    this.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  }

  enable() {
    this.updateElement({
      isDisabled: false,
      isDeleting: false,
      isSaving: false
    });
  }

  _restoreHandlers() {
  }

  _formEscHandler = (evt) => {
    if (evt.code === 'Escape') {
      evt.preventDefault();
      this.#handlerFormEsc();
    }
  };

}
