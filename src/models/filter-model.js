import Observable from '../framework/observable';
import {FilterTypes} from '../const-values';

export default class FilterModel extends Observable {
  #filter = FilterTypes.EVERYTHING;

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
