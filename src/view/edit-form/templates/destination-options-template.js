import he from 'he';

export function createDestinationOptionsTemplate(destinations = []) {
  return `
    <datalist id='destination-list'>
      ${destinations.map((destination) => {
    const safeName = he.encode(destination.name);
    return `<option value='${safeName}'></option>`;
  }).join('')}
    </datalist>
  `;
}
