import Observable from '../framework/observable';
import {FILTER_TYPES} from '../const-values';

export default class FilterModel extends Observable {
  #filter = FILTER_TYPES.EVERYTHING;

  getFilter() {
    return this.#filter;
  }

  setFilter(filterType) {
    if (this.#filter === filterType) {
      return;
    }
    this.#filter = filterType;
    this._notify('filterChanged', filterType);
  }
}
