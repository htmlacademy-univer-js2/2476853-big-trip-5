/* eslint-disable no-use-before-define */
import EventList from '../view/event-list';
import Filters from '../view/filters';
import EventItem from '../view/event-item';
import Sort from '../view/sort';
import EditForm from '../view/edit-form';
import {render, replace} from '../framework/render';
import EmptyEventList from "../view/empty-event-list";

class MainPresenter {
  #eventListComponent = new EventList();
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

    render(new Filters({events: this.events}), this.#filterContainer);

    if (this.events.length === 0) {
      render(new EmptyEventList(), this.#eventsContainer);
      return;
    }

    render(new Sort(), this.#eventsContainer);
    render(this.#eventListComponent, this.#eventsContainer);

    for (const element of this.events) {
      this.#renderItem(element);
    }
  }

  #renderItem(point) {
    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        switchToEvent();
        document.removeEventListener('keydown', onKeydown);
      }
    };

    const eventComponent = new EventItem({
      event: point,
      offers: this.offers,
      destinations: this.destinations,
      onEditButtonClick: () => {
        switchToForm();
        document.addEventListener('keydown', onKeydown);
      }
    });

    const editFormComponent = new EditForm({
      event: point,
      offers: this.offers,
      destinations: this.destinations,
      onSubmit: () => {
        switchToEvent();
        document.removeEventListener('keydown', onKeydown);
      },
      onReset: () => {
        switchToEvent();
        document.removeEventListener('keydown', onKeydown);
      }
    });

    const switchToForm = () => replace(editFormComponent, eventComponent);

    const switchToEvent = () => replace(eventComponent, editFormComponent);

    render(eventComponent, this.#eventListComponent.element);
  }
}

export default MainPresenter;
