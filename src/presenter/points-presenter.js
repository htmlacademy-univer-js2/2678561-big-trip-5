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
  #sortContainer = null;

  constructor({ container, pointsModel, filterModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init(sortContainer) {
    this.#sortContainer = sortContainer;
    this.#renderSort();
    this.#renderPointsList();
  }

  #renderSort() {
    const pointsCount = this.#getFilteredPoints().length;

    if (pointsCount === 0) {
      if (this.#sortPresenter) {
        this.#sortPresenter.destroy();
        this.#sortPresenter = null;
      }
      return;
    }

    if (!this.#sortPresenter) {
      this.#sortPresenter = new SortPresenter({
        container: this.#sortContainer,
        onSortChange: this.#handleSortChange,
      });
    }

    this.#sortPresenter.init(this.#currentSortType);
  }

  #renderPoints() {
    const points = this.#getSortedPoints();
    points.forEach((point) => this.#renderPoint(point));
  }

  #getFilteredPoints() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    return filter[filterType](points);
  }

  #getSortedPoints() {
    const filteredPoints = this.#getFilteredPoints();
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

  #renderPointsList() {
    const points = this.#getSortedPoints();
    const hasPoints = points.length > 0;

    this.#renderSort();

    if (hasPoints) {
      this.#removeEmptyPoints();
      this.#renderPoints();
    } else {
      this.#renderEmptyPoints();
    }
  }

  #renderEmptyPoints() {
    if (this.#emptyPointsComponent) {
      remove(this.#emptyPointsComponent);
      this.#emptyPointsComponent = null;
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
