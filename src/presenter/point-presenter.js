import { clear } from '../utils.js';
import { render, RenderPosition } from '../render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import NoPointView from '../view/no-point-view.js';
import NewPointView from '../view/new-point-view.js';

export default class PointPresenter {
  #pointListContainer;
  #editFormView = null;
  #newPointFormView = null;
  #pointsModel = null;
  #editingPointView = null;

  constructor({ pointListContainer, pointsModel }) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsModel.subscribe((eventList) => this.#reRenderPointsView(eventList));
    const events = this.#pointsModel.events;
    this.#reRenderPointsView(events);

    if (!events.length) {
      render(new NoPointView(), this.#pointListContainer.element);
    }
  }

  #reRenderPointsView(events) {
    clear(this.#pointListContainer.element);
    const onEditClick = (pointView) => this.#onEditClick(pointView);

    const onFavoriteClick = (pointView) => {
      this.#pointsModel.switchPointIsFavorite(pointView.pointId);
    };

    const newEvent = document.querySelector('.trip-main__event-add-btn');
    const onNewPointClick = (pointView) => this.#onNewPointClick(pointView);
    newEvent.addEventListener('click', onNewPointClick);

    for (const point of events) {
      this.#renderPoint(new PointView(point, { onEditClick, onFavoriteClick }));
    }
  }

  #closeEditPointForm(pointView) {
    this.#editFormView.close();
    pointView.show();
    this.#editingPointView = null;
  }

  #closeNewPointForm() {
    this.#newPointFormView.close();
  }

  #closeForms() {
    if (this.#newPointFormView) {
      this.#newPointFormView.close();
    }

    if (this.#editFormView) {
      this.#editFormView.close();
    }
  }

  #renderPoint(pointView) {
    render(pointView, this.#pointListContainer.element);
  }

  #onEditClick(pointView) {
    this.#editingPointView?.show();
    this.#editingPointView = pointView;
    pointView.hide();

    this.#closeForms();

    this.#editFormView = new PointEditView(
      {
        event: pointView.event,
        offersMap: this.#pointsModel.offersMap,
        destinations: this.#pointsModel.destinations,
      },
      {
        onFormSubmit: (pointUpdateParams) => {
          this.#pointsModel.updatePoint(pointUpdateParams);
          this.#closeEditPointForm(pointView);
        },
        onEsc: () => this.#closeEditPointForm(pointView),
        onCancel: () => this.#closeEditPointForm(pointView),
      }
    );
    render(
      this.#editFormView,
      pointView.element
    );
  }

  #onNewPointClick() {

    this.#closeForms();

    this.#newPointFormView = new NewPointView(
      {
        offersMap: this.#pointsModel.offersMap,
        destinations: this.#pointsModel.destinations,
      },
      {
        onFormSubmit: (pointParams) => {
          this.#pointsModel.addPoint(pointParams);
          this.#closeNewPointForm();
        },
        onEsc: () => this.#closeNewPointForm(),
        onCancel: () => this.#closeNewPointForm(),
      }
    );

    render(
      this.#newPointFormView,
      this.#pointListContainer.element,
      RenderPosition.BEFOREBEGIN
    );
  }
}
