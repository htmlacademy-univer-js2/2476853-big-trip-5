import AbstractView from '../framework/view/abstract-view';
import {filterByTime} from '../utils/date';

const filterTemplate = (filter, isChecked, isDisabled) => {
  const {type} = filter;
  return (
    `<div class="trip-filters__filter">
       <input id="filter-${type}"
             class="trip-filters__filter-input  visually-hidden"
             type="radio"
             name="trip-filter"
             value="${type}"
             ${isChecked ? 'checked' : ''}
             ${isDisabled ? 'disabled' : ''}>
       <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
     </div>`
  );
};

const filtersTemplate = (filters, currentFilter) => (
  `<form class="trip-filters" action="#" method="get">
       ${filters.map((filter) => filterTemplate(filter, filter.type === currentFilter, filter.isDisabled)).join('')}
       <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

class Filters extends AbstractView {
  #currentFilter = null;
  _callback = null;
  #events = null;

  constructor({currentFilter, onFilterTypeChange, events}) {
    super();
    this.#currentFilter = currentFilter;
    this._callback = onFilterTypeChange;
    this.#events = events;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return filtersTemplate(this.#createFilters(), this.#currentFilter);
  }

  #createFilters() {
    return Object.entries(filterByTime).map(
      ([filterType, filterFunction]) => {
        const hasMatchingEvents = filterFunction(this.#events).length > 0;
        return {
          type: filterType,
          isSelected: filterType === this.#currentFilter,
          isDisabled: !hasMatchingEvents
        };
      }
    );
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT' || evt.target.disabled) {
      return;
    }
    this._callback(evt.target.value);
  };
}

export default Filters;
