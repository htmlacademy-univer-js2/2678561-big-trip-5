import AbstractView from '../../framework/view/abstract-view.js';
import { createFiltersTemplate } from './templates/main-template.js';

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor({ filters, currentFilter }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }
}
