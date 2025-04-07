import AbstractView from '../framework/view/abstract-view';
import {filterByTime} from '../utils/date';

const filterTemplate = (filter, isChecked) => {
  const {type, count} = filter;
  return (
    `<div class="trip-filters__filter">
       <input id="filter-${type}"
             class="trip-filters__filter-input  visually-hidden"
             type="radio"
             name="trip-filter"
             value="${type}"
             ${isChecked ? 'checked' : ''}
             ${count === 0 ? 'disabled' : ''}>
       <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
     </div>`
  );
};

const filtersTemplate = (filters) => (
  `<form class="trip-filters" action="#" method="get">
       ${filters.map((currentFilter, index) => filterTemplate(currentFilter, index === 0)).join('')}
       <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

class Filters extends AbstractView {
  #events = null;

  constructor({events}) {
    super();
    this.#events = events;
  }

  get template() {
    return filtersTemplate(this.#createFilters());
  }

  #createFilters() {
    return Object.entries(filterByTime).map(
      ([filterType, filterEvents]) => ({
        type: filterType,
        count: filterEvents(this.#events).length,
      }),
    );
  }
}

export default Filters;
