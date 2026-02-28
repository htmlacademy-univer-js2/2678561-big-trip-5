import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

import PointsApiService from './api/points-api-service.js';

import { AUTHORIZATION, END_POINT } from './const.js';

const tripEvents = document.querySelector('.trip-events');
const sortContainer = document.createElement('form');
sortContainer.className = 'trip-events__trip-sort trip-sort';

const eventsList = document.createElement('ul');
eventsList.className = 'trip-events__list';

tripEvents.append(sortContainer, eventsList);

const apiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({ apiService });
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  sortContainer,
  filtersContainer: document.querySelector('.trip-controls__filters'),
  tripEventsContainer: eventsList,
  pointsModel,
  filterModel,
});

boardPresenter.init();
pointsModel.init();
