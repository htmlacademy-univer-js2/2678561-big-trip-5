import AbstractView from '../../framework/view/abstract-view.js';
import { createFiltersTemplate } from './templates/main-template.js';

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #onFilterChange = null;

  constructor({ filters, currentFilter, onFilterChange }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterChangeHandler = (evt) => {
    if (evt.target.name !== 'trip-filter') {
      return;
    }
    this.#onFilterChange(evt.target.value);
  };
}
