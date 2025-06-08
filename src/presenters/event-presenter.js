import EventItem from '../view/event-item';
import EditForm from '../view/edit-form';
import {remove, render, RenderPosition, replace} from '../framework/render';
import {PointState, UserAction} from '../const-values';

export default class EventPresenter {
  #container = null;
  #event = null;
  #offers = null;
  #destinations = null;
  #onDataChange = null;
  #onViewChange = null;
  #state = PointState.DEFAULT;
  #isNewEvent = false;
  #placement = null;
  #eventComponent = null;
  #editComponent = null;

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

  get event() {
    return this.#event;
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
      onDelete: this.#handleDeleteClick,
      isNewEvent: this.#isNewEvent
    });

    if (!prevEventComponent && !prevEditComponent) {
      if (this.#isNewEvent) {
        render(this.#editComponent, this.#container, this.#placement);
        document.addEventListener('keydown', this.#escKeyDownHandler);
        this.#state = PointState.EDIT;
      } else {
        render(this.#eventComponent, this.#container, this.#placement);
      }
    } else if (this.#state === PointState.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    } else {
      replace(this.#editComponent, prevEditComponent);
    }
  }

  resetView() {
    if (this.#state === PointState.EDIT) {
      this.#replaceFormToEvent();
    }
  }

  updateEvent(updatedEvent) {
    this.#event = updatedEvent;
    this.#editComponent.updateOriginalState(updatedEvent);
    this.init();
  }

  setSaving() {
    if (this.#state === PointState.EDIT) {
      this.#editComponent.setSaving();
    }
  }

  setDeleting() {
    if (this.#state === PointState.EDIT) {
      this.#editComponent.setDeleting();
    }
  }

  setAborting() {
    if (this.#state === PointState.EDIT) {
      this.#editComponent.setAborting();
    } else {
      this.#eventComponent.shake();
    }
  }

  destroy() {
    if (this.#state === PointState.EDIT) {
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
    remove(this.#eventComponent);
    remove(this.#editComponent);
  }

  #replaceFormToEvent() {
    this.#editComponent.resetToOriginalState();
    if (this.#isNewEvent) {
      this.#onViewChange();
      return;
    }
    replace(this.#eventComponent, this.#editComponent);
    this.#state = PointState.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleEditClick = () => {
    this.#onViewChange();
    replace(this.#editComponent, this.#eventComponent);
    this.#state = PointState.EDIT;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = async (pointData) => {
    const success = await this.#onDataChange(this.#isNewEvent ? UserAction.ADD : UserAction.UPDATE, pointData);
    if (success) {
      this.#replaceFormToEvent();
    }
  };

  #handleFormReset = () => {
    this.#replaceFormToEvent();
  };

  #handleFavoriteClick = () => {
    const updatedEvent = {...this.#event, isFavorite: !this.#event.isFavorite};
    this.#onDataChange(UserAction.UPDATE, updatedEvent);
  };

  #handleDeleteClick = () => {
    if (this.#isNewEvent) {
      this.#onViewChange();
      return;
    }
    this.#onDataChange(UserAction.DELETE, this.#event);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.resetView();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };
}
