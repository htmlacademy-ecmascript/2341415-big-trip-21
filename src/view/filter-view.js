import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(type, isChecked) {
  return (
    `<div
      class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}"
      ${isChecked ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
}

function createFilterTemplate(filterItems) {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');
  return (
    `<form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;

  constructor({ availableFilters }, listeners) {
    super();
    this.#filters = availableFilters;
    this.#initListeners(listeners);
  }

  #initListeners({ onFilterClick }) {
    const filterInputElements = this.element.querySelectorAll('.trip-filters__filter-input');

    for(const element of filterInputElements) {
      element.addEventListener('input', (evt) => {
        evt.preventDefault();
        onFilterClick(evt.target.value);
      });
    }
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
