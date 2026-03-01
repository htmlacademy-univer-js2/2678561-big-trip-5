import { getLabel } from '../../../utils/utils.js';

export function createFilterItemTemplate(filter, currentFilter) {
  const { type, count, isDisabled } = filter;

  return `
    <div class='trip-filters__filter'>
      <input 
        id='filter-${type}' 
        class='trip-filters__filter-input  visually-hidden' 
        type='radio' 
        name='trip-filter' 
        value='${type}'
        ${type === currentFilter ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class='trip-filters__filter-label' for='filter-${type}'>
        ${getLabel(type)} ${count}
      </label>
    </div>
  `;
}
