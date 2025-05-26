import {render, replace} from '../framework/render';
import FiltersView from '../view/filters';
import {UPDATE_TYPE} from '../const-values';

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #eventModel = null;
  #filtersComponent = null;

  constructor(container, filterModel, eventModel) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#eventModel = eventModel;
    this.#eventModel.addObserver(this.#handleModelEvent);
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UPDATE_TYPE.UPDATE || updateType === UPDATE_TYPE.LOADED) {
      this.init();
    }
  };

  init() {
    const prevComponent = this.#filtersComponent;
    const filtersComponent = new FiltersView({
      currentFilter: this.#filterModel.getFilter(),
      onFilterTypeChange: this.#handleFilterTypeChange,
      events: this.#eventModel.events
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
