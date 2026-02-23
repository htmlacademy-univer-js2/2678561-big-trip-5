import FilterPresenter from './filter-presenter.js';
import PointsPresenter from './points-presenter.js';
import CreatePresenter from './create-presenter.js';
import { UserAction, UpdateType, FilterType } from '../const.js';

export default class BoardPresenter {
  #pointsModel = null;
  #filterModel = null;
  #filtersPresenter = null;
  #pointsPresenter = null;
  #createPresenter = null;
  #sortContainer = null;

  constructor({ sortContainer, filtersContainer, tripEventsContainer, pointsModel, filterModel }) {
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#filtersPresenter = new FilterPresenter({
      container: filtersContainer,
      pointsModel: this.#pointsModel,
      filterModel: this.#filterModel,
    });

    this.#pointsPresenter = new PointsPresenter({
      container: tripEventsContainer,
      pointsModel: this.#pointsModel,
      filterModel: this.#filterModel,
      onDataChange: this.#handleViewAction,
    });

    this.#createPresenter = new CreatePresenter({
      container: tripEventsContainer,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
    });

    this.#sortContainer = sortContainer;
  }

  get points() {
    return this.#pointsModel.points;
  }

  #handleNewEventClick = () => {
    if (this.#createPresenter.isCreating()) {
      return;
    }

    this.#filterModel.setFilter(
      UpdateType.MAJOR,
      FilterType.EVERYTHING
    );

    this.#createPresenter.init();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {

      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;

      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;

      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update.id);
        break;
    }
  };

  init() {
    this.#filtersPresenter.init();
    this.#pointsPresenter.init(this.#sortContainer);

    document
      .querySelector('.trip-main__event-add-btn')
      .addEventListener('click', this.#handleNewEventClick);
  }
}
