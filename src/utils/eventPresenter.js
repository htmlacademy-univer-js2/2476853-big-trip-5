import EventItem from '../view/event-item';
import EditForm from '../view/edit-form';
import {remove, render, RenderPosition, replace} from '../framework/render';
import {POINT_STATE, USER_ACTION} from '../const-values';

export default class EventPresenter {
  #container = null;
  #event = null;
  #offers = null;
  #destinations = null;
  #onDataChange = null;
  #onViewChange = null;
  #state = POINT_STATE.DEFAULT;
  #isNewEvent = false;
  #placement = null;
  #eventComponent = null;
  #editComponent = null;

  get event() {
    return this.#event;
  }

  constructor({container, event, offers, destinations, onDataChange, onViewChange, isNewEvent = false, placement = RenderPosition.BEFOREEND}) {
    this.#container = container;
    this.#event = event;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onDataChange = onDataChange;
    this.#onViewChange = onViewChange;
    this.#isNewEvent = isNewEvent;
    this.#placement = placement;
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
      onReset: this.#handleFormReset,
      onDelete: this.#handleDeleteClick
    });

    if (!prevEventComponent && !prevEditComponent) {
      if (this.#isNewEvent) {
        render(this.#editComponent, this.#container, this.#placement);
      } else {
        render(this.#eventComponent, this.#container, this.#placement);
      }
    } else if (this.#state === POINT_STATE.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    } else {
      replace(this.#editComponent, prevEditComponent);
    }
  }

  #handleEditClick = () => {
    this.#onViewChange();
    replace(this.#editComponent, this.#eventComponent);
    this.#state = POINT_STATE.EDIT;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = async (e) => {
    const success = await this.#onDataChange(this.#isNewEvent ? USER_ACTION.ADD : USER_ACTION.UPDATE, e);
    if (success) {
      this.#replaceFormToEvent();
    }
  };

  #handleFormReset = () => {
    this.#replaceFormToEvent();
  };

  #replaceFormToEvent() {
    if (this.#isNewEvent) {
      return;
    }
    replace(this.#eventComponent, this.#editComponent);
    this.#state = POINT_STATE.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#state === POINT_STATE.EDIT) {
      this.#replaceFormToEvent();
    }
  }

  #handleFavoriteClick = () => {
    const updatedEvent = {...this.#event, isFavorite: !this.#event.isFavorite};
    this.#onDataChange(USER_ACTION.UPDATE, updatedEvent);
  };

  #handleDeleteClick = () => {
    this.#onDataChange(USER_ACTION.DELETE, this.#event);
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

  setSaving() {
    if (this.#state === POINT_STATE.EDIT) {
      this.#editComponent.setSaving();
    }
  }

  setDeleting() {
    if (this.#state === POINT_STATE.EDIT) {
      this.#editComponent.setDeleting();
    }
  }

  setAborting() {
    if (this.#state === POINT_STATE.EDIT) {
      this.#editComponent.setAborting();
    } else {
      this.#eventComponent.shake();
    }
  }

  destroy() {
    if (this.#state === POINT_STATE.EDIT) {
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
    remove(this.#eventComponent);
    remove(this.#editComponent);
  }
}
