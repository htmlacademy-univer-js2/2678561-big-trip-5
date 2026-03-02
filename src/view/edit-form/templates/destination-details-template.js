import he from 'he';

export function createDestinationDetailsTemplate(destination) {
  if (!destination) {
    return '';
  }

  const { description, pictures = [] } = destination;
  const safeDescription = he.encode(description);

  return `
    <section class='event__section event__section--destination'>
      <h3 class='event__section-title event__section-title--destination'>Destination</h3>
      ${description ? `<p class='event__destination-description'>${safeDescription}</p>` : ''}
      
      ${pictures.length ? `
        <div class='event__photos-container'>
          <div class='event__photos-tape'>
            ${pictures.map((pic) => `
              <img class='event__photo' src='${he.encode(pic.src)}' alt='${he.encode(pic.description)}'>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </section>
  `;
}
