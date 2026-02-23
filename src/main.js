import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const tripEvents = document.querySelector('.trip-events');
const sortContainer = document.createElement('form');
sortContainer.className = 'trip-events__trip-sort trip-sort';

const eventsList = document.createElement('ul');
eventsList.className = 'trip-events__list';

tripEvents.append(sortContainer, eventsList);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

new BoardPresenter({
  sortContainer,
  filtersContainer: document.querySelector('.trip-controls__filters'),
  tripEventsContainer: eventsList,
  pointsModel,
  filterModel,
}).init();
