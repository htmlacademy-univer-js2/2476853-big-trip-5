import AbstractView from '../framework/view/abstract-view';

const eventListTemplate = '<ul class="trip-events__list">';

class EventList extends AbstractView {
  get template() {
    return eventListTemplate;
  }
}

export default EventList;
