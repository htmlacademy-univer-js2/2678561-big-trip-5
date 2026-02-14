export function createDestinationDetailsTemplate(destination) {
  if (!destination) {
    return '';
  }

  const { description, pictures = [] } = destination;

  return `
    <section class='event__section event__section--destination'>
      <h3 class='event__section-title event__section-title--destination'>Destination</h3>
      ${description ? `<p class='event__destination-description'>${description}</p>` : ''}
      
      ${pictures.length ? `
        <div class='event__photos-container'>
          <div class='event__photos-tape'>
            ${pictures.map((pic) => `
              <img class='event__photo' src='${pic.src}' alt='${pic.description}'>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </section>
  `;
}