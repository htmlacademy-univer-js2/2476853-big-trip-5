import {render, RenderPosition} from '../framework/render';
import Header from '../view/header';

class HeaderPresenter {
  #headerContainer = null;
  #eventModel = null;

  constructor(headerContainer, eventModel) {
    this.#headerContainer = headerContainer;
    this.#eventModel = eventModel;
  }

  init() {
    this.events = [...this.#eventModel.events];
    this.destinations = [...this.#eventModel.destinations];
    render(new Header({
      events: this.events,
      destinations: this.#getDestinations()
    }), this.#headerContainer, RenderPosition.AFTERBEGIN);
  }

  #getDestinations() {
    const destinations = this.events.map((event) => event.destination);
    return this.destinations.filter((destination) => destinations.includes(destination.id));
  }
}

export default HeaderPresenter;
