import { createFilterItemTemplate } from './filter-item-template.js';

export function createFiltersTemplate(filters, currentFilter) {
  return `
    <form class='trip-filters' action='#' method='get'>
      ${filters
    .map((filter) =>
      createFilterItemTemplate(filter, currentFilter)
    )
    .join('')}
      <button class='visually-hidden' type='submit'>Accept filter</button>
    </form>
  `;
}
