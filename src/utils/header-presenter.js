import {render, replace, RenderPosition} from '../framework/render';
import Header from '../view/header';
import {UPDATE_TYPE} from '../const-values';

class HeaderPresenter {
  #headerContainer = null;
  #eventModel = null;
  #headerComponent = null;

  constructor(headerContainer, eventModel) {
    this.#headerContainer = headerContainer;
    this.#eventModel = eventModel;
    this.#eventModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderHeader();
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UPDATE_TYPE.UPDATE || updateType === UPDATE_TYPE.LOADED) {
      this.#renderHeader(true);
    }
  };

  #renderHeader(replaceExisting = false) {
    const events = [...this.#eventModel.events];
    const destinationsList = [...this.#eventModel.destinations];
    const headerComponent = new Header({
      events,
      destinations: this.#getDestinations(events, destinationsList)
    });
    if (replaceExisting && this.#headerComponent) {
      replace(headerComponent, this.#headerComponent);
    } else {
      render(headerComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
    }
    this.#headerComponent = headerComponent;
  }

  #getDestinations(events, destinations) {
    const eventDestinations = events.map((event) => event.cityDestination);
    return destinations.filter((destination) => eventDestinations.includes(destination.id));
  }
}

export default HeaderPresenter;
