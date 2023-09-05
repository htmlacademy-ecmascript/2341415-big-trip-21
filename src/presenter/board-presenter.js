import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { logFormData, } from '../utils.js';
import EditFormContainerView from '../view/edit-form-container-view.js';

export default class BoardPresenter {
  #container;
  #pointsModel;
  #boardPoints = [];

  #sortComponent = new SortView();
  #editFormContainer = new EditFormContainerView();
  #eventListComponent = new EventListView();
  #editFormView = null;

  constructor({container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = this.#pointsModel.get();

    render(this.#sortComponent, this.#container);
    render(this.#editFormContainer, this.#container);
    render(this.#eventListComponent, this.#container);

    for (const pointModel of this.#boardPoints) {
      this.#renderPoint(
        pointModel,
        {
          onEditClick: (pointView) => this.#onEditClick(pointView)
        }
      );
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
