import EventList from '../view/event-list';
import EmptyEventList from '../view/empty-event-list';
import LoadingView from '../view/loading';
import ErrorView from '../view/error';
import Sort from '../view/sort';
import {filterByTime} from '../utils/date';
import EventPresenter from './event-presenter';
import {render, remove, RenderPosition} from '../framework/render';
import {FILTER_TYPES, UPDATE_TYPE, USER_ACTION} from '../const-values';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TIME_LIMIT = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

class MainPresenter {
  #eventListComponent = null;
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();
  #eventPresenters = [];
  #sortComponent = null;
  #currentSortType = 'sort-price';
  #eventsContainer = null;
  #eventModel = null;
  #filterModel = null;
  #newEventPresenter = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TIME_LIMIT.LOWER_LIMIT,
    upperLimit: TIME_LIMIT.UPPER_LIMIT,
  });

  constructor(eventsContainer, eventModel, filterModel) {
    this.#eventsContainer = eventsContainer;
    this.#eventModel = eventModel;
    this.#filterModel = filterModel;

    this.#eventModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver((eventType) => {
      if (eventType === 'filterChanged') {
        this.#currentSortType = 'sort-price';
        this.#clearBoard();
        this.init();
      }
    });
  }

  init() {
    if (this.#eventModel.isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#eventModel.isError) {
      this.#renderError();
      return;
    }

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

    const sortedEvents = this.#getSortedEvents(this.events, this.#currentSortType);
    for (const event of sortedEvents) {
      this.#renderItem(event);
    }
  }

  #getSortedEvents(events, sortType) {
    switch (sortType) {
      case 'sort-day':
        return [...events].sort((a, b) => a.dateFrom - b.dateFrom);
      case 'sort-time':
        return [...events].sort(
          (a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom)
        );
      case 'sort-price':
        return [...events].sort((a, b) => b.price - a.price);
      default:
        return [...events];
    }
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#eventsContainer);
  }

  #renderError() {
    render(this.#errorComponent, this.#eventsContainer);
  }

  #handleModelEvent = (eventType) => {
    switch (eventType) {
      case UPDATE_TYPE.LOADING:
        this.#clearBoard();
        this.#renderLoading();
        break;
      case UPDATE_TYPE.LOADED:
        remove(this.#loadingComponent);
        this.init();
        break;
      case UPDATE_TYPE.ERROR:
        remove(this.#loadingComponent);
        this.#renderError();
        break;
      case UPDATE_TYPE.UPDATE:
        this.#clearBoard();
        this.init();
        break;
    }
  };

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
    const sortedEvents = this.#getSortedEvents(this.events, sortType);
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
    remove(this.#loadingComponent);
    remove(this.#errorComponent);
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

  #handleViewAction = async (actionType, update) => {
    this.#uiBlocker.block();
    let success = false;

    const eventPresenter = this.#eventPresenters.find((presenter) => presenter.event?.id === update.id) || this.#newEventPresenter;

    try {
      switch (actionType) {
        case USER_ACTION.UPDATE:
          eventPresenter?.setSaving();
          await this.#eventModel.updateEvent(update);
          break;
        case USER_ACTION.DELETE:
          eventPresenter?.setDeleting();
          await this.#eventModel.removeEvent(update);
          break;
        case USER_ACTION.ADD:
          this.#newEventPresenter?.setSaving();
          await this.#eventModel.createEvent(update);
          this.#newEventPresenter?.destroy();
          this.#newEventPresenter = null;
          break;
      }
      success = true;
    } catch (err) {
      if (actionType === USER_ACTION.UPDATE || actionType === USER_ACTION.DELETE) {
        eventPresenter?.setAborting();
      } else if (actionType === USER_ACTION.ADD) {
        this.#newEventPresenter?.setAborting();
      }
    } finally {
      this.#uiBlocker.unblock();
    }
    return success;
  };
}

export default MainPresenter;
