import AbstractView from '../../framework/view/abstract-view.js';
import { createRoutePointTemplate } from './templates/main-template.js';

export default class RoutePointView extends AbstractView {
  #point = {};
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor(point = {}, onEditClick, onFavoriteClick) {
    super();
    this.#point = point;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createRoutePointTemplate(this.#point);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

}
