import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  eventListComponent = new EventListView();

  constructor({container, pointsModel }) {
    this.container = container;
    this.pointsModel = pointsModel;
  }

  init() {
    this.boardPoints = this.pointsModel.get();

    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);
    render(
      new PointEditView(this.boardPoints.at(0)),
      this.eventListComponent.getElement()
    );

    for (const pointModel of this.boardPoints) {
      render(
        new PointView({pointModel}),
        this.eventListComponent.getElement()
      );
    }
  }
}
