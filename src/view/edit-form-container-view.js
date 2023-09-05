import AbstractView from '../framework/view/abstract-view.js';

function createTemplate() {
  return '<div class="edit_form_container"></div>';
}

export default class EditFormContainerView extends AbstractView {
  get template() {
    return createTemplate();
  }
}
