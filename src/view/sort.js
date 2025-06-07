import AbstractView from '../framework/view/abstract-view';

const SORT_TYPES = [
  {
    type: 'sort-day',
    name: 'Day',
    disabled: false
  },
  {
    type: 'sort-event',
    name: 'Event',
    disabled: true
  },
  {
    type: 'sort-time',
    name: 'Time',
    disabled: false
  },
  {
    type: 'sort-price',
    name: 'Price',
    disabled: false
  },
  {
    type: 'sort-offer',
    name: 'Offers',
    disabled: true
  }
];

const createSortItemTemplate = (sortType, currentSortType) => {
  const {type, name, disabled} = sortType;
  const isChecked = type === currentSortType;

  return `<div class="trip-sort__item  trip-sort__item--${type.replace('sort-', '')}">
        <input id="${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${type}"${isChecked ? ' checked' : ''}${disabled ? ' disabled' : ''}>
        <label class="trip-sort__btn" for="${type}">${name}</label>
    </div>`;
};

const createSortTemplate = (currentSortType) => {
  const sortItemsTemplate = SORT_TYPES
    .map((sortType) => createSortItemTemplate(sortType, currentSortType))
    .join('');

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortItemsTemplate}
</form>`;
};

class Sort extends AbstractView {
  #currentSortType = null;

  constructor({currentSortType = 'sort-day', onSortTypeChange} = {}) {
    super();
    this.#currentSortType = currentSortType;
    this._callback = onSortTypeChange;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT' || evt.target.disabled) {
      return;
    }
    this._callback(evt.target.value);
  };

  get template() {
    return createSortTemplate(this.#currentSortType);
  }
}

export default Sort;
