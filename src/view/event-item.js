import {formatDate, getDuration} from '../utils/date';
import AbstractView from '../framework/view/abstract-view';

const eventItemTemplate = (event, offersList, destinations) => {
  const {price, dateFrom, dateTo, cityDestination, isFavorite, offers, type} = event;
  const eventTypeOffers = offersList.find((offer) => offer.type === type);
  const destination = destinations.find((item) => item.id === cityDestination);

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">${formatDate(dateFrom)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="2019-03-18T10:30">${formatDate(dateFrom)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="2019-03-18T11:00">${formatDate(dateTo)}</time>
                  </p>
                  <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${eventTypeOffers.offers.map((offer) => {
    return (`<li class="event__offer">
                 <span class="event__offer-title">${offer.title}</span>
                 &plus;&euro;&nbsp;
                 <span class="event__offer-price">${offer.price}</span>
                 </li>`);
  }).join('')}
                </ul>
                <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
};

class EventItem extends AbstractView {
  #event = null;
  #offers = null;
  #destinations = null;
  #onEditButtonClick = null;

  constructor({event, offers, destinations, onEditButtonClick}) {
    super();
    this.#event = event;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onEditButtonClick = onEditButtonClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditButtonClick);
  }

  get template() {
    return eventItemTemplate(this.#event, this.#offers, this.#destinations);
  }
}

export default EventItem;
