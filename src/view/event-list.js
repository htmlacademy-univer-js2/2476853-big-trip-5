import AbstractView from '../framework/view/abstract-view';

const createEventListTemplate = '<ul class="trip-events__list">';

class EventList extends AbstractView {
  get template() {
    return createEventListTemplate;
  }
}

export default EventList;
