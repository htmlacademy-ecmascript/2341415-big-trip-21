import TripInfoView from './view/trip-info-view.js';
import {render} from './render.js';
import { RenderPosition } from './render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';

const bodyElement = document.querySelector('body');
const headerElenent = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElenent.querySelector('.trip-main');
const filterElement = headerElenent.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

function run(pointsModel) {
  const boardPresenter = new BoardPresenter({
    container: eventListElement,
    pointsModel,
    filterElement,
  });

  render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
  boardPresenter.init();
}

new PointsModel()
  .init()
  .then((pointsModel) => run(pointsModel));
