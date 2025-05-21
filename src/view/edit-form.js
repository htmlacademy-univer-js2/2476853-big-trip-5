import {DATE_TYPE, POINT_TYPES} from '../const-values';
import {formatDate} from '../utils/date';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const editFormTemplate = (event, offersList, destinations) => {
  const {price, dateFrom, dateTo, cityDestination, offers, type} = event;
  const eventTypeOffers = offersList.find((offer) => offer.type === type);
  const destination = destinations.find((item) => item.id === cityDestination);
  const destinationsToOptions = destinations.map((item) => `<option value="${item.name}"></option>`).join('');

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                            ${POINT_TYPES.map((eventType) => (`<div class="event__type-item">
                                          <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === type ? 'checked' : ''}>
                                          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label></div>`)).join('')}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${destinationsToOptions}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom, DATE_TYPE.DATE)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo, DATE_TYPE.DATE)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                        ${eventTypeOffers.offers.map((offer) => (`<div class="event__offer-selector">
                                <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage" ${offers.includes(offer.id) ? 'checked' : ''}>
                                <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
                                  <span class="event__offer-title">${offer.title}</span>
                                  &plus;&euro;&nbsp;
                                  <span class="event__offer-price">${offer.price}</span>
                            </label>
                          </div>`)).join('')}
                    </div>
                  </section>
                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination.description}</p>
                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${destination.pictures.map((image) => `<img class="event__photo" src="${image.src}" alt="${image.description}">`).join('')}
                      </div>
                    </div>
                  </section>
                </section>
              </form>
            </li>`;
};

class EditForm extends AbstractStatefulView {
  #offers = null;
  #destinations = null;
  #onSubmit = null;
  #onReset = null;
  #originalState = null;

  constructor({event, offers, destinations, onSubmit, onReset}) {
    super();
    this._setState(event);
    this.#originalState = structuredClone(event);
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onSubmit = onSubmit;
    this.#onReset = onReset;
    this._restoreHandlers();
  }

  get template() {
    return editFormTemplate(this._state, this.#offers, this.#destinations);
  }

  _restoreHandlers() {
    const form = this.element.querySelector('form');
    form.addEventListener('submit', this.#submitHandler);
    form.addEventListener('reset', this.#resetHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetHandler);
    this.element.querySelectorAll('input[name="event-type"]').forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((input) => {
      input.addEventListener('change', this.#offersChangeHandler);
    });
    flatpickr(
      this.element.querySelector('input[name="event-start-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        // eslint-disable-next-line camelcase
        time_24hr: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      }
    );
    flatpickr(
      this.element.querySelector('input[name="event-end-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        // eslint-disable-next-line camelcase
        time_24hr: true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      }
    );
  }

  #dateFromChangeHandler = ([selectedDate]) => {
    if (this._state.dateTo < selectedDate) {
      this.updateElement({dateTo: selectedDate});
    }
    this.updateElement({dateFrom: selectedDate});
  };

  #dateToChangeHandler = ([selectedDate]) => {
    if (this._state.dateFrom > selectedDate) {
      this.updateElement({dateFrom: selectedDate});
    }
    this.updateElement({dateTo: selectedDate});
  };

  #submitHandler = (e) => {
    e.preventDefault();
    this.#onSubmit(this._state);
  };

  #resetHandler = (e) => {
    e.preventDefault();
    this.updateElement(this.#originalState);
    this.#onReset();
  };

  #typeChangeHandler = (e) => {
    const newType = e.target.value;
    this.updateElement({type: newType, offers: []});
  };

  #destinationChangeHandler = (e) => {
    const newName = e.target.value;
    const dest = this.#destinations.find((d) => d.name === newName);
    if (dest) {
      this.updateElement({cityDestination: dest.id});
    }
  };

  #offersChangeHandler = (e) => {
    const offerId = parseInt(e.target.id.split('-').pop(), 10);
    const currentOffers = [...this._state.offers];
    if (e.target.checked) {
      currentOffers.push(offerId);
    } else {
      const index = currentOffers.indexOf(offerId);
      if (index > -1) {
        currentOffers.splice(index, 1);
      }
    }
    this.updateElement({offers: currentOffers});
  };
}

export default EditForm;
