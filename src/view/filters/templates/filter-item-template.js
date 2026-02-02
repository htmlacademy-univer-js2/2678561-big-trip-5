import { getLabel } from '../../../utils/utils.js';

export function createFilterItemTemplate({ type, count }, currentFilter) {
  return `
    <div class='trip-filters__filter'>
      <input 
        id='filter-${type}' 
        class='trip-filters__filter-input  visually-hidden' 
        type='radio' 
        name='trip-filter' 
        value='${type}'
        ${type === currentFilter ? 'checked' : ''}
        ${count === 0 ? 'disabled' : ''}
      >
      <label class='trip-filters__filter-label' for='filter-${type}'>
        ${getLabel(type)}
      </label>
    </div>
  `;
}
