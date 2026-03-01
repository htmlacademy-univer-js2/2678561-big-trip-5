import FilterPresenter from './filter-presenter.js';
import PointsPresenter from './points-presenter.js';
import CreatePresenter from './create-presenter.js';
import { UserAction, UpdateType, FilterType, TimeLimit } from '../const.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class BoardPresenter {
  #pointsModel = null;
  #filterModel = null;
  #filtersPresenter = null;
  #pointsPresenter = null;
  #createPresenter = null;
  #sortContainer = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          this.#pointsPresenter.setSaving(update.id);
          await this.#pointsModel.updatePoint(updateType, update);
          break;

        case UserAction.ADD_POINT:
          this.#createPresenter.setSaving();
          await this.#pointsModel.addPoint(updateType, update);
          this.#createPresenter.destroy();
          break;

        case UserAction.DELETE_POINT:
          this.#pointsPresenter.setDeleting(update.id);
          await this.#pointsModel.deletePoint(updateType, update);
          break;
      }
    } catch (err) {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
        case UserAction.DELETE_POINT:
          this.#pointsPresenter.setAborting(update.id);
          break;

        case UserAction.ADD_POINT:
          this.#createPresenter.setAborting();
          break;
      }
    }

    this.#uiBlocker.unblock();
  };

  init() {
    this.#filtersPresenter.init();
    this.#pointsPresenter.init(this.#sortContainer);

    document
      .querySelector('.trip-main__event-add-btn')
      .addEventListener('click', this.#handleNewEventClick);
  }
}
