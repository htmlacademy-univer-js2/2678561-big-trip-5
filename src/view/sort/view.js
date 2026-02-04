import AbstractView from '../../framework/view/abstract-view.js';
import { createSortTemplate } from './templates/main-template.js';

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor({ currentSortType }) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }
}
