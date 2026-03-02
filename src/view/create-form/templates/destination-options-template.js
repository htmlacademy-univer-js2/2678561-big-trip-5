import he from 'he';

export function createDestinationOptionsTemplate(destinations = []) {
  return `
    <datalist id='destination-list-1'>
      ${destinations.map((destination) => `<option value='${he.encode(destination.name)}'></option>`).join('')}
    </datalist>
  `;
}
