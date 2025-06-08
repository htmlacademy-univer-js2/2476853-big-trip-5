import AbstractView from '../framework/view/abstract-view';

import {FilterTypes} from '../const-values';

const EmptyListMessages = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.PAST]: 'There are no past events now',
  [FilterTypes.PRESENT]: 'There are no present events now',
  [FilterTypes.FUTURE]: 'There are no future events now',
};

const createEmptyEventListTemplate = (filterType) =>
  `<p class="trip-events__msg">${EmptyListMessages[filterType]}</p>`;

class EmptyEventList extends AbstractView {
  #filterType = FilterTypes.EVERYTHING;

  constructor({filterType = FilterTypes.EVERYTHING} = {}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyEventListTemplate(this.#filterType);
  }
}

export default EmptyEventList;
