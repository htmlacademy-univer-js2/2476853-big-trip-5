import AbstractView from '../framework/view/abstract-view';

const emptyEventListTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

class EmptyEventList extends AbstractView {
  get template() {
    return emptyEventListTemplate();
  }
}

export default EmptyEventList;
