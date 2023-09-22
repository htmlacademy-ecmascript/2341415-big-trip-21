import { logFormData, clear } from '../utils.js';
import { render } from '../render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import NoPointView from '../view/no-point-view.js';
import { cityDescriptions } from '../mock/fake-data.js';

export default class PointPresenter {
  #pointListContainer;
  #editFormView = null;
  #pointsModel = null;
  #editingPointView = null;

  constructor({ pointListContainer, pointsModel }) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsModel.subscribe((points) => this.#reRenderPointView(points));
    this.#reRenderPointView(this.#pointsModel.points);

    if (!this.#pointsModel.points.length) {
      render(new NoPointView(), this.#pointListContainer.element);
    }
  }

  #reRenderPointView(points) {
    clear(this.#pointListContainer.element);
    const onEditClick = (pointView) => this.#onEditClick(pointView);
    const onFavoriteClick = (pointView) => {
      this.#pointsModel.switchPointIsFavorite(pointView.pointId);
      const newPoint = this.#pointsModel.getPoint(pointView.pointId);
      const newPointView = new PointView(newPoint, { onEditClick, onFavoriteClick });
      this.#pointListContainer.element.replaceChild(newPointView.element, pointView.element);
    };

    for (const point of points) {
      this.#renderPoint(new PointView(point, { onEditClick, onFavoriteClick }));
    }
  }

  #closeForm(pointView) {
    this.#editFormView.close();
    pointView.show();
    this.#editingPointView = null;
  }

  #renderPoint(pointView) {
    render(pointView, this.#pointListContainer.element);
  }

  #onEditClick(pointView) {
    this.#editingPointView?.show();
    this.#editingPointView = pointView;
    pointView.hide();

    if(this.#editFormView) {
      this.#editFormView.close();
    }

    this.#editFormView = new PointEditView(
      {
        point: pointView.point,
        cityDescriptions
      },
      {
        onFormSubmit: (formData) => {
          logFormData(formData);
          this.#closeForm(pointView);
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
