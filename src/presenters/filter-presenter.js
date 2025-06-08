import {render, replace} from '../framework/render';
import FiltersView from '../view/filters';
import {UpdateType} from '../const-values';

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
    this.#filterModel.addObserver(this.#handleFilterModelEvent);
  }

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

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.UPDATE || updateType === UpdateType.LOADED) {
      this.init();
    }
  };

  #handleFilterModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    this.#filterModel.setFilter(filterType);
  };
}
