import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { logFormData, clear } from '../utils.js';
import EditFormContainerView from '../view/edit-form-container-view.js';
import NoPointView from '../view/no-point-view.js';

export default class BoardPresenter {
  #container;
  #pointsModel;

  #sortComponent = new SortView();
  #editFormContainer = new EditFormContainerView();
  #eventListComponent = new EventListView();
  #editFormView = null;

  constructor({container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    render(this.#sortComponent, this.#container);
    render(this.#editFormContainer, this.#container);
    render(this.#eventListComponent, this.#container);

    this.#pointsModel.subscribe((filtredPoints) => this.#reRenderPointView(filtredPoints));

    this.#reRenderPointView(this.#pointsModel.filtredPoints);
  }

  #reRenderPointView(pointModels) {
    clear(this.#eventListComponent.element);

    for (const pointModel of pointModels) {
      this.#renderPoint(
        pointModel,
        {
          onEditClick: (pointView) => this.#onEditClick(pointView)
        }
      );
    }

    if (this.#pointsModel.filtredPoints.length === 0) {
      render(new NoPointView(), this.#eventListComponent.element);
    }
  }

  #closeForm(pointView) {
    this.#editFormView.close();
    pointView.show();
  }

  #renderPoint(pointModel, listeners) {
    const pointComponent = new PointView(pointModel, listeners);
    render(pointComponent, this.#eventListComponent.element);
  }

  #onEditClick(pointView) {
    pointView.hide();

    if(this.#editFormView) {
      this.#editFormView.close();
    }

    this.#editFormView = new PointEditView(
      pointView.point,
      {
        onFormSubmit: (formData) => {
          logFormData(formData);
          this.#editFormView.close();
          pointView.show();
        },
        onEsc: () => this.#closeForm(pointView),
        onCancel: () => this.#closeForm(pointView),
      }
    );
    render(
      this.#editFormView,
      pointView.element
    );
  }
}
