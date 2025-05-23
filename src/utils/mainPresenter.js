import EventList from '../view/event-list';
import EmptyEventList from '../view/empty-event-list';
import Sort from '../view/sort';
import {filterByTime} from './date';
import EventPresenter from './eventPresenter';
import {render, remove, RenderPosition} from '../framework/render';
import {FILTER_TYPES, USER_ACTION} from '../const-values';

class MainPresenter {
  #eventListComponent = null;
  #eventPresenters = [];
  #sortComponent = null;
  #currentSortType = 'sort-price';
  #eventsContainer = null;
  #eventModel = null;
  #filterModel = null;
  #newEventPresenter = null;

  constructor(eventsContainer, eventModel, filterModel) {
    this.#eventsContainer = eventsContainer;
    this.#eventModel = eventModel;
    this.#filterModel = filterModel;
    this.#filterModel.addObserver((eventType) => {
      if (eventType === 'filterChanged') {
        this.#currentSortType = 'sort-price';
        this.#clearBoard();
        this.init();
      }
    });
  }

  init() {
    const allEvents = this.#eventModel.events;
    const currentFilter = this.#filterModel.getFilter();
    this.events = filterByTime[currentFilter](allEvents);
    this.offers = [...this.#eventModel.offers];
    this.destinations = [...this.#eventModel.destinations];
    this.#eventPresenters = [];
    if (this.events.length === 0) {
      this.#eventListComponent = new EmptyEventList({filterType: currentFilter});
      render(this.#eventListComponent, this.#eventsContainer);
      return;
    } else {
      this.#eventListComponent = new EventList();
    }
    this.#sortComponent = new Sort({onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortComponent, this.#eventsContainer);
    render(this.#eventListComponent, this.#eventsContainer);
    for (const event of this.events) {
      this.#renderItem(event);
    }
  }

  createEvent() {
    if (this.#newEventPresenter) {
      return;
    }

    this.#handleViewChange();
    this.#filterModel.setFilter(FILTER_TYPES.EVERYTHING);
    const newEvent = {
      id: String(Date.now()),
      type: 'flight',
      offers: [],
      price: 0,
      isFavorite: false
    };
    const eventPresenter = new EventPresenter({
      container: this.#eventListComponent.element,
      event: newEvent,
      offers: this.offers,
      destinations: this.destinations,
      onDataChange: this.#handleViewAction,
      onViewChange: this.#handleViewChange,
      isNewEvent: true,
      placement: RenderPosition.AFTERBEGIN
    });
    eventPresenter.init();
    this.#newEventPresenter = eventPresenter;
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
    this.#newEventPresenter?.destroy();
    this.#newEventPresenter = null;
  };

  #clearBoard = () => {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }
    this.#clearEventList();
    remove(this.#eventListComponent);
  };

  #handleViewChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
    this.#newEventPresenter?.destroy();
    this.#newEventPresenter = null;
  };

  #renderItem(point) {
    const eventPresenter = new EventPresenter({
      container: this.#eventListComponent.element,
      event: point,
      offers: this.offers,
      destinations: this.destinations,
      onDataChange: this.#handleViewAction,
      onViewChange: this.#handleViewChange
    });
    this.#eventPresenters.push(eventPresenter);
    eventPresenter.init();
  }

  #handleViewAction = (actionType, update) => {
    switch (actionType) {
      case USER_ACTION.UPDATE:
        this.#eventModel.updateEvent(update);
        break;
      case USER_ACTION.DELETE:
        this.#eventModel.deleteEvent(update.id);
        break;
      case USER_ACTION.ADD:
        this.#eventModel.addEvent(update);
        this.#newEventPresenter.destroy();
        this.#newEventPresenter = null;
        break;
    }
    this.#clearBoard();
    this.init();
  };
}

export default MainPresenter;
