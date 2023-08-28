import FilterView from './view/filter-view.js';
import TripInfoView from './view/trip-info-view.js';
import {render} from './render.js';
import { RenderPosition } from './render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import fakeData from './mock/fake-data.js';
// import DectinationsModel from './model/destinations-model.js';
// import OffersModel from './model/offers- model.js';

const bodyElement = document.querySelector('body');
const headerElenent = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElenent.querySelector('.trip-main');
const filterElement = headerElenent.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const pointsModel = new PointsModel(fakeData);
// const destinationsModel = new DectinationsModel(fakeData);
// const offersModel = new OffersModel(fakeData);

const boardPresenter = new BoardPresenter({
  container: eventListElement,
  pointsModel,
  // destinationsModel,
  // offersModel
});

render(new FilterView(), filterElement);
render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);

boardPresenter.init();

