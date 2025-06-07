import EventList from '../view/event-list';
import EmptyEventList from '../view/empty-event-list';
import LoadingView from '../view/loading';
import ErrorView from '../view/error';
import Sort from '../view/sort';
import {filterByTime} from '../utils/date';
import EventPresenter from './event-presenter';
import {render, remove, RenderPosition} from '../framework/render';
import {FilterTypes, UpdateType, UserAction} from '../const-values';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TIME_LIMIT = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

class MainPresenter {
  #eventListComponent = null;
  #emptyEventListComponent = null;
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();
  #eventPresenters = [];
  #sortComponent = null;
  #currentSortType = 'sort-day';
  #eventsContainer = null;
  #eventModel = null;
  #filterModel = null;
  #newEventButton = null;
  #newEventPresenter = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TIME_LIMIT.LOWER_LIMIT,
    upperLimit: TIME_LIMIT.UPPER_LIMIT,
  });

  constructor(eventsContainer, eventModel, filterModel, newEventButton) {
    this.#eventsContainer = eventsContainer;
    this.#eventModel = eventModel;
    this.#filterModel = filterModel;
    this.#newEventButton = newEventButton;

    this.#eventModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver((eventType) => {
      if (eventType === 'filterChanged') {
        this.#currentSortType = 'sort-day';
        this.#clearBoard();
        this.init();
      }
    });
  }

  get events() {
    const allEvents = this.#eventModel.events;
    const currentFilter = this.#filterModel.getFilter();
    return filterByTime[currentFilter](allEvents);
  }

  get offers() {
    return [...this.#eventModel.offers];
  }

  get destinations() {
    return [...this.#eventModel.destinations];
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

    this.#eventPresenters = [];
    const events = this.events;

    if (events.length === 0) {
      this.#emptyEventListComponent = new EmptyEventList({filterType: this.#filterModel.getFilter()});
      this.#eventListComponent = this.#emptyEventListComponent;
      render(this.#eventListComponent, this.#eventsContainer);
      return;
    } else {
      this.#eventListComponent = new EventList();
    }

    this.#sortComponent = new Sort({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#eventsContainer);
    render(this.#eventListComponent, this.#eventsContainer);

    const sortedEvents = this.#getSortedEvents(events, this.#currentSortType);
    for (const event of sortedEvents) {
      this.#renderItem(event);
    }
  }

  createEvent() {
    this.#handleViewChange();
    this.#filterModel.setFilter(FilterTypes.EVERYTHING);
    this.#currentSortType = 'sort-day';
    if (this.events.length === 0 && this.#emptyEventListComponent) {
      remove(this.#emptyEventListComponent);
      this.#eventListComponent = new EventList();
      this.#sortComponent = new Sort({
        currentSortType: this.#currentSortType,
        onSortTypeChange: this.#handleSortTypeChange
      });
      render(this.#sortComponent, this.#eventsContainer);
      render(this.#eventListComponent, this.#eventsContainer);
    } else if (!this.#eventListComponent || this.#eventListComponent === this.#emptyEventListComponent) {
      this.#clearBoard();
      this.init();
    }

    this.#newEventButton.disabled = true;

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
      case UpdateType.LOADING:
        this.#clearBoard();
        this.#renderLoading();
        break;
      case UpdateType.LOADED:
        remove(this.#loadingComponent);
        this.init();
        break;
      case UpdateType.ERROR:
        remove(this.#loadingComponent);
        this.#renderError();
        break;
      case UpdateType.UPDATE:
        this.#clearBoard();
        this.init();
        break;
    }
  };

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
    if (this.#eventListComponent && this.#eventListComponent !== this.#emptyEventListComponent) {
      remove(this.#eventListComponent);
    } else if (this.#eventListComponent === this.#emptyEventListComponent) {
      remove(this.#emptyEventListComponent);
    }
    this.#eventListComponent = null;
    remove(this.#loadingComponent);
    remove(this.#errorComponent);
  };

  #handleViewChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());

    if (this.#newEventPresenter && this.events.length === 0) {
      this.#newEventPresenter?.destroy();
      this.#newEventPresenter = null;
      this.#newEventButton.disabled = false;

      if (this.#sortComponent) {
        remove(this.#sortComponent);
        this.#sortComponent = null;
      }
      if (this.#eventListComponent && this.#eventListComponent !== this.#emptyEventListComponent) {
        remove(this.#eventListComponent);
      }

      if (this.#emptyEventListComponent) {
        this.#eventListComponent = this.#emptyEventListComponent;
        render(this.#eventListComponent, this.#eventsContainer);
      }
      return;
    }

    this.#newEventPresenter?.destroy();
    this.#newEventPresenter = null;
    this.#newEventButton.disabled = false;
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
        case UserAction.UPDATE:
          eventPresenter?.setSaving();
          await this.#eventModel.updateEvent(update);
          break;
        case UserAction.DELETE:
          eventPresenter?.setDeleting();
          await this.#eventModel.removeEvent(update);
          break;
        case UserAction.ADD:
          this.#newEventPresenter?.setSaving();
          await this.#eventModel.createEvent(update);
          this.#newEventPresenter?.destroy();
          this.#newEventPresenter = null;
          this.#newEventButton.disabled = false;
          break;
      }
      success = true;
    } catch (err) {
      if (actionType === UserAction.UPDATE || actionType === UserAction.DELETE) {
        eventPresenter?.setAborting();
      } else if (actionType === UserAction.ADD) {
        this.#newEventPresenter?.setAborting();
        this.#newEventButton.disabled = false;
      }
    } finally {
      this.#uiBlocker.unblock();
    }
    return success;
  };
}

export default MainPresenter;
