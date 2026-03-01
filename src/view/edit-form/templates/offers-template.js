import he from 'he';

function createOfferTemplate(offer, isSelected) {
  const { id, title, price } = offer;

  const safeTitle = he.encode(title);

  return `
    <div class='event__offer-selector'>
      <input class='event__offer-checkbox visually-hidden' id='event-offer-${id}' type='checkbox' name='event-offer-${id}' ${isSelected ? 'checked' : ''}>
      <label class='event__offer-label' for='event-offer-${id}'>
        <span class='event__offer-title'>${safeTitle}</span>
        &plus;&euro;&nbsp;
        <span class='event__offer-price'>${price}</span>
      </label>
    </div>
  `;
}

export function createOffersTemplate(offers = [], selectedOfferIds = []) {
  if (!offers || !offers.length) {
    return '';
  }

  return `
    <section class='event__section event__section--offers'>
      <h3 class='event__section-title event__section-title--offers'>Offers</h3>
      <div class='event__available-offers'>
        ${offers.map((offer) => createOfferTemplate(offer, selectedOfferIds.includes(offer.id))).join('')}
      </div>
    </section>
  `;
}
