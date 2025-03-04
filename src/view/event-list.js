import {createElement} from '../render';

const eventListTemplate = '<ul class="trip-events__list">';

class EventList {
  getTemplate() {
    return eventListTemplate;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

export default EventList;
