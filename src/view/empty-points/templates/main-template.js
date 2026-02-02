import { EmptyPointsText } from '../../../const.js';

export function createEmptyPointsTemplate(filterType) {
  return `
    <p class='trip-events__msg'>
      ${EmptyPointsText[filterType]}
    </p>
  `;
}
