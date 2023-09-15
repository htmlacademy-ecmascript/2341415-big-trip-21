import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EditFormContainerView from '../view/edit-form-container-view.js';
import { RenderPosition } from '../render.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';
import FilterView from '../view/filter-view.js';

export default class BoardPresenter {
  #container;
  #pointPresenter;
  #boardPoints = [];
  #pointsModel;
  #filterElement;

  #sortComponent = null;
  #editFormContainer = new EditFormContainerView();
  #eventListComponent = new EventListView();
  #sourcedBoardPoints = [];

  constructor({container, pointsModel, filterElement }) {
    this.#pointsModel = pointsModel;
    this.#container = container;
    this.#boardPoints = pointsModel.filtredPoints;
    this.#sourcedBoardPoints = pointsModel.filtredPoints;
    this.#filterElement = filterElement;
    this.#pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent,
      onDataChange: this.#handlePointChange,
      pointsModel,
    });
  }

  init() {
    this.#pointPresenter.init();
    render(this.#editFormContainer, this.#container);
    render(this.#eventListComponent, this.#container);
    this.#renderSort();
    this.#renderFilters();
  }

  #renderFilters() {
    render(
      new FilterView(
        {
          filters: this.#pointsModel.filterTypes,
          availableFilters: this.#pointsModel.availableFilterTypes
        },
        {
          onFilterClick: (filterType) => {
            this.#pointsModel.selectFilter(filterType);
          },
        }
      ),
      this.#filterElement
    );
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      sortType: this.#pointsModel.sortType,
      onSortTypeChange: (sortBy) => this.#pointsModel.setSorting(sortBy),
    });

    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };
}
