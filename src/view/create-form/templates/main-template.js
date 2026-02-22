import { getLabel, formatDate, formatTime } from '../../../utils/utils.js';
import { createEventTypesTemplate } from './event-types-template.js';
import { createDestinationOptionsTemplate } from './destination-options-template.js';
import { createEventDetailsTemplate } from './event-details-template.js';

export function createCreateFormTemplate(data = {}, isFormValid = true) {
  const { point = {}, destinations = [], offersByType = [] } = data;

  const {
    type = 'flight',
    destination = '',
    dateFrom = dayjs().toISOString(),
    dateTo = dayjs().add(1, 'hour').toISOString(),
    price = '',
    offers = [],
  } = point;

  const destinationObj = destinations.find((d) => d.id === destination);
  const destinationName = destinationObj?.name ?? '';
  const currentDestination = destinationObj || destinations[0] || null;
  const selectedOfferIds = offers;

  const displayDateFrom = `${formatDate(dateFrom)} ${formatTime(dateFrom)}`;
  const displayDateTo = `${formatDate(dateTo)} ${formatTime(dateTo)}`;

  return `
    <form class='event event--edit' action='#' method='post'>
      <header class='event__header'>
        <div class='event__type-wrapper'>
          <label class='event__type event__type-btn' for='event-type-toggle'>
            <span class='visually-hidden'>Choose event type</span>
            <img class='event__type-icon' width='17' height='17' src='img/icons/${type}.png' alt='Event type icon'>
          </label>
          <input class='event__type-toggle visually-hidden' id='event-type-toggle' type='checkbox'>
          <div class='event__type-list'>
            ${createEventTypesTemplate(type)}
          </div>
        </div>

        <div class='event__field-group event__field-group--destination'>
          <label class='event__label event__type-output' for='event-destination'>
            ${getLabel(type)}
          </label>
          <input class='event__input event__input--destination' id='event-destination' type='text' name='event-destination' value='${destinationName}' list='destination-list' required>
          ${createDestinationOptionsTemplate(destinations)}
        </div>

        <div class='event__field-group event__field-group--time'>
          <label class='visually-hidden' for='event-start-time'>From</label>
          <input class='event__input event__input--time' id='event-start-time' type='text' name='event-start-time' value='${displayDateFrom}' required>
          &mdash;
          <label class='visually-hidden' for='event-end-time'>To</label>
          <input class='event__input event__input--time' id='event-end-time' type='text' name='event-end-time' value='${displayDateTo}' required>
        </div>

        <div class='event__field-group event__field-group--price'>
          <label class='event__label' for='event-price'>
            <span class='visually-hidden'>Price</span>
            &euro;
          </label>
          <input class='event__input event__input--price' id='event-price' type='number' min='1' max='1000000' step='1' name='event-price' value='${price}' required>
        </div>

        <button class='event__save-btn btn btn--blue' type='submit' ${!isFormValid ? 'disabled' : ''}>Save</button>
        <button class='event__reset-btn' type='reset'>Cancel</button>
      </header>
      
      ${createEventDetailsTemplate(offersByType, currentDestination, selectedOfferIds)}
    </form>
  `;
}
