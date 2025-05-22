import {render, replace} from '../framework/render';
import FiltersView from '../view/filters';

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #filtersComponent = null;

  constructor(container, filterModel) {
    this.#container = container;
    this.#filterModel = filterModel;
  }

  init() {
    const prevComponent = this.#filtersComponent;
    const filtersComponent = new FiltersView({
      currentFilter: this.#filterModel.getFilter(),
      onFilterTypeChange: this.#handleFilterTypeChange
    });
    this.#filtersComponent = filtersComponent;
    if (prevComponent === null) {
      render(filtersComponent, this.#container);
    } else {
      replace(filtersComponent, prevComponent);
    }
  }

  #handleFilterTypeChange = (filterType) => {
    this.#filterModel.setFilter(filterType);
  };
}
