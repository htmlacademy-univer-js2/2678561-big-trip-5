import { getLabel } from '../../../utils/utils.js';
import { createPointOffersTemplate } from './point-offers-template.js';
import { createFavoriteButtonTemplate } from './favorite-button-template.js';

export function createRoutePointTemplate(point = {}) {
  const {
    type = '',
    destinationName = '',
    formattedDate = '',
    formattedStartTime = '',
    formattedEndTime = '',
    duration = '',
    eventTitle = '',
    price = 0,
    isFavorite = false,
    offers = [],
  } = point;

  const title = eventTitle || `${getLabel(type)} ${destinationName}`;

  return `
    <li class='trip-events__item'>
      <div class='event'>
        <time class='event__date' datetime='${point.dateFrom || ''}'>${formattedDate}</time>
        <div class='event__type'>
          <img class='event__type-icon' width='42' height='42' src='img/icons/${type}.png' alt='Event type icon'>
        </div>
        <h3 class='event__title'>${title}</h3>
        <div class='event__schedule'>
          <p class='event__time'>
            <time class='event__start-time' datetime='${point.dateFrom || ''}'>${formattedStartTime}</time>
            &mdash;
            <time class='event__end-time' datetime='${point.dateTo || ''}'>${formattedEndTime}</time>
          </p>
          <p class='event__duration'>${duration}</p>
        </div>
        <p class='event__price'>
          &euro;&nbsp;<span class='event__price-value'>${price}</span>
        </p>
        ${createPointOffersTemplate(offers)}
        ${createFavoriteButtonTemplate(isFavorite)}
        <button class='event__rollup-btn' type='button'>
          <span class='visually-hidden'>Open event</span>
        </button>
      </div>
    </li>
  `;
}
