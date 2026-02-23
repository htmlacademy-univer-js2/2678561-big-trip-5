import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters/view.js';
import { FilterType, UpdateType } from '../const.js';
import { isFuture, isPresent, isPast } from '../utils/filters.js';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;
  #filterComponent = null;

  constructor({ container, pointsModel, filterModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const filters = this.#getFiltersData();

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

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #getFiltersData() {
    const points = this.#pointsModel.points;

    return [
      {
        type: FilterType.EVERYTHING,
        count: points.length,
        isDisabled: points.length === 0,
      },
      {
        type: FilterType.FUTURE,
        count: points.filter(isFuture).length,
        isDisabled: points.filter(isFuture).length === 0,
      },
      {
        type: FilterType.PRESENT,
        count: points.filter(isPresent).length,
        isDisabled: points.filter(isPresent).length === 0,
      },
      {
        type: FilterType.PAST,
        count: points.filter(isPast).length,
        isDisabled: points.filter(isPast).length === 0,
      },
    ];
  }
}
