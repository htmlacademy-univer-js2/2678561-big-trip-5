import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters/view.js';
import { UpdateType } from '../const.js';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;
  #filterComponent = null;

  constructor({ container, pointsModel, filterModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const filters = this.#getFilters();

    const prevComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView({
      filters,
      currentFilter: this.#filterModel.filter,
      onFilterChange: this.#handleFilterTypeChange,
    });

    if (prevComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevComponent);
    remove(prevComponent);
  }

  #getFilters() {
    const points = this.#pointsModel.points;
    const enabledFilters = this.#filterModel.getEnabledFilters(points);

    return enabledFilters.map((filter) => ({
      ...filter,
      isDisabled: filter.count === 0
    }));
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
