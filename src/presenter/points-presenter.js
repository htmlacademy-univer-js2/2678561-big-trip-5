import { render, remove } from '../framework/render.js';
import EmptyPointsView from '../view/empty-points/view.js';
import SortPresenter from './sort-presenter.js';
import PointPresenter from './point-presenter.js';
import { sortPointsBy } from '../utils/sort.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { filter } from '../utils/filters.js';


export default class PointsPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sortPresenter = null;
  #emptyPointsComponent = null;

  constructor({ container, pointsModel, filterModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init(sortContainer) {
    this.#renderSort(sortContainer);
    this.#renderPointsList();
  }

  #renderSort(sortContainer) {
    if (this.#sortPresenter) {
      this.#sortPresenter.setSort(this.#currentSortType);
    } else {
      this.#sortPresenter = new SortPresenter({
        container: sortContainer,
        onSortChange: this.#handleSortChange,
      });
      this.#sortPresenter.init();
    }
  }

  #renderPoints() {
    const points = this.#getSortedPoints();
    points.forEach((point) => this.#renderPoint(point));
  }

  #getSortedPoints() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;

    const filteredPoints = filter[filterType](points);

    return sortPointsBy(filteredPoints, this.#currentSortType);
  }

  #renderPoint(point) {
    const presenter = new PointPresenter({
      container: this.#container,
      pointsModel: this.#pointsModel,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction,
    });

    presenter.init(point);
    this.#pointPresenters.set(point.id, presenter);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleModelEvent = (updateType, updatedPoint) => {
    switch (updateType) {

      case UpdateType.PATCH:
        this.#pointPresenters.get(updatedPoint.id)?.init(updatedPoint);
        break;

      case UpdateType.MINOR:
        this.#reRenderPoints();
        break;

      case UpdateType.MAJOR:
        this.#currentSortType = SortType.DAY;

        if (this.#sortPresenter) {
          this.#sortPresenter.setSort(this.#currentSortType);
        }

        this.#reRenderPoints();
        break;
    }
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

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#sortPresenter.setSort(sortType);
    this.#reRenderPoints();
  };

  #renderEmptyPoints() {
    if (this.#emptyPointsComponent) {
      return;
    }

    this.#emptyPointsComponent = new EmptyPointsView({
      filterType: this.#filterModel.filter
    });

    render(this.#emptyPointsComponent, this.#container);
  }

  #removeEmptyPoints() {
    if (!this.#emptyPointsComponent) {
      return;
    }

    remove(this.#emptyPointsComponent);
    this.#emptyPointsComponent = null;
  }

  #renderPointsList() {
    const points = this.#getSortedPoints();

    if (points.length === 0) {
      this.#renderEmptyPoints();
      return;
    }

    this.#removeEmptyPoints();
    this.#renderPoints();
  }

  #reRenderPoints() {
    this.#clearPoints();
    this.#renderPointsList();
  }

  destroy() {
    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);

    if (this.#sortPresenter) {
      this.#sortPresenter.destroy();
      this.#sortPresenter = null;
    }

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
