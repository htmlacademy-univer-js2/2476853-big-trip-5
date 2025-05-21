import EventItem from '../view/event-item';
import EditForm from '../view/edit-form';
import {render, replace} from '../framework/render';

const STATE = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

export default class EventPresenter {
  #container = null;
  #event = null;
  #offers = null;
  #destinations = null;
  #onDataChange = null;
  #onViewChange = null;
  #state = STATE.DEFAULT;

  #eventComponent = null;
  #editComponent = null;

  constructor({container, event, offers, destinations, onDataChange, onViewChange}) {
    this.#container = container;
    this.#event = event;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onDataChange = onDataChange;
    this.#onViewChange = onViewChange;
  }

  init() {
    const prevEventComponent = this.#eventComponent;
    const prevEditComponent = this.#editComponent;

    this.#eventComponent = new EventItem({
      event: this.#event,
      offers: this.#offers,
      destinations: this.#destinations,
      onEditButtonClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editComponent = new EditForm({
      event: this.#event,
      offers: this.#offers,
      destinations: this.#destinations,
      onSubmit: this.#handleFormSubmit,
      onReset: this.#handleFormReset
    });

    if (!prevEventComponent) {
      render(this.#eventComponent, this.#container);
    } else if (this.#state === STATE.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    } else {
      replace(this.#editComponent, prevEditComponent);
    }
  }

  #handleEditClick = () => {
    this.#onViewChange();
    replace(this.#editComponent, this.#eventComponent);
    this.#state = STATE.EDIT;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToEvent();
  };

  #handleFormReset = () => {
    this.#replaceFormToEvent();
  };

  #replaceFormToEvent() {
    replace(this.#eventComponent, this.#editComponent);
    this.#state = STATE.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#state === STATE.EDIT) {
      this.#replaceFormToEvent();
    }
  }

  #handleFavoriteClick = () => {
    const updatedEvent = {...this.#event, isFavorite: !this.#event.isFavorite};
    this.#onDataChange(updatedEvent);
  };

  #escKeyDownHandler = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.resetView();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  updateEvent(updatedEvent) {
    this.#event = updatedEvent;
    this.init();
  }
}
