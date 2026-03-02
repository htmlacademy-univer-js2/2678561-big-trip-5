import he from 'he';

function createDestinationPhotosTemplate(pictures = []) {
  if (!pictures || !pictures.length) {
    return '';
  }

  return `
    <div class='event__photos-container'>
      <div class='event__photos-tape'>
        ${pictures.map((picture) => `<img class='event__photo' src='${he.encode(picture.src)}' alt='${he.encode(picture.description)}'>`).join('')}
      </div>
    </div>
  `;
}

export function createDestinationDetailsTemplate(destination) {
  if (!destination) {
    return '';
  }

  const { description, pictures } = destination;
  const safeDescription = he.encode(description);

  return `
    <section class='event__section  event__section--destination'>
      <h3 class='event__section-title  event__section-title--destination'>Destination</h3>
      ${description ? `<p class='event__destination-description'>${safeDescription}</p>` : ''}
      ${pictures && pictures.length ? createDestinationPhotosTemplate(pictures) : ''}
    </section>
  `;
}
