import {render, replace, remove, RenderPosition} from '../framework/render';
import Header from '../view/header';
import {UpdateType} from '../const-values';

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

  #renderHeader() {
    const events = [...this.#eventModel.events];

    if (events.length === 0) {
      this.#removeHeader();
      return;
    }

    const headerComponent = new Header({
      events,
      destinations: events.map((event) => this.#eventModel.destinations.find((destination) => destination.id === event.cityDestination)),
      offers: this.#eventModel.offers
    });

    if (this.#headerComponent) {
      replace(headerComponent, this.#headerComponent);
    } else {
      render(headerComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
    }
    this.#headerComponent = headerComponent;
  }

  #removeHeader() {
    if (this.#headerComponent) {
      remove(this.#headerComponent);
      this.#headerComponent = null;
    }
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.UPDATE || updateType === UpdateType.LOADED) {
      this.#renderHeader();
    }
  };
}

export default HeaderPresenter;
