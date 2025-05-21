import EventList from '../view/event-list';
import Filters from '../view/filters';
import Sort from '../view/sort';
import EmptyEventList from '../view/empty-event-list';
import EventPresenter from './eventPresenter';
import {render} from '../framework/render';

class MainPresenter {
  #eventListComponent = new EventList();
  #eventPresenters = [];
  #eventsContainer = null;
  #filterContainer = null;
  #eventModel = null;

  constructor(eventsContainer, filterContainer, eventModel) {
    this.#eventsContainer = eventsContainer;
    this.#filterContainer = filterContainer;
    this.#eventModel = eventModel;
  }

  init() {
    this.events = [...this.#eventModel.events];
    this.offers = [...this.#eventModel.offers];
    this.destinations = [...this.#eventModel.destinations];

    this.#eventPresenters = [];

    render(new Filters({events: this.events}), this.#filterContainer);

    if (this.events.length === 0) {
      render(new EmptyEventList(), this.#eventsContainer);
      return;
    }

    render(new Sort(), this.#eventsContainer);
    render(this.#eventListComponent, this.#eventsContainer);

    for (const event of this.events) {
      this.#renderItem(event);
    }
  }

  #handleViewChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderItem(point) {
    const eventPresenter = new EventPresenter({
      container: this.#eventListComponent.element,
      event: point,
      offers: this.offers,
      destinations: this.destinations,
      onDataChange: (updatedEvent) => {
        this.#eventModel.updateEvent(updatedEvent);
        eventPresenter.updateEvent(updatedEvent);
      },
      onViewChange: this.#handleViewChange
    });
    this.#eventPresenters.push(eventPresenter);
    eventPresenter.init();
  }
}

export default MainPresenter;
