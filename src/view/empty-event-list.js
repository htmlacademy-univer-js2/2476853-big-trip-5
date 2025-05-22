import AbstractView from '../framework/view/abstract-view';

import {FILTER_TYPES} from '../const-values';

const emptyMessages = {
  [FILTER_TYPES.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPES.PAST]: 'There are no past events now',
  [FILTER_TYPES.PRESENT]: 'There are no present events now',
  [FILTER_TYPES.FUTURE]: 'There are no future events now',
};

const emptyEventListTemplate = (filterType) =>
  `<p class="trip-events__msg">${emptyMessages[filterType]}</p>`;

class EmptyEventList extends AbstractView {
  #filterType = FILTER_TYPES.EVERYTHING;

  constructor({filterType} = {}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return emptyEventListTemplate(this.#filterType);
  }
}

export default EmptyEventList;
