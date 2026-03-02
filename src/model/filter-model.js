import Observable from '../framework/observable.js';
import {FilterType} from '../const.js';
import { isFuture, isPresent, isPast } from '../utils/filters.js';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }


  getEnabledFilters(points) {
    return [
      {
        type: 'everything',
        count: points.length
      },
      {
        type: 'future',
        count: points.filter(isFuture).length
      },
      {
        type: 'present',
        count: points.filter(isPresent).length
      },
      {
        type: 'past',
        count: points.filter(isPast).length
      }
    ];
  }
}
