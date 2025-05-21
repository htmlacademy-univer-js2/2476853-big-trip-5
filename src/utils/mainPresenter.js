import EventList from '../view/event-list';
import Filters from '../view/filters';
import Sort from '../view/sort';
import EmptyEventList from '../view/empty-event-list';
import EventPresenter from './eventPresenter';
import {render} from '../framework/render';

class MainPresenter {
  #eventListComponent = new EventList();
  #eventPresenters = [];
  #sortComponent = null;
  #currentSortType = 'sort-price';
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

    this.#sortComponent = new Sort({onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortComponent, this.#eventsContainer);
    render(this.#eventListComponent, this.#eventsContainer);

    for (const event of this.events) {
      this.#renderItem(event);
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    let sortedEvents;
    switch (sortType) {
      case 'sort-day':
        sortedEvents = [...this.events].sort((a, b) => a.dateFrom - b.dateFrom);
        break;
      case 'sort-time':
        sortedEvents = [...this.events].sort(
          (a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom)
        );
        break;
      case 'sort-price':
        sortedEvents = [...this.events].sort((a, b) => b.price - a.price);
        break;
      default:
        sortedEvents = [...this.events];
    }
    this.#clearEventList();
    for (const event of sortedEvents) {
      this.#renderItem(event);
    }
  };

  #clearEventList = () => {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters = [];
  };

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
