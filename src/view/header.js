import AbstractView from '../framework/view/abstract-view';
import {formatDate} from '../utils/date';
import {DATE_TYPE} from '../const-values';

function createHeaderTemplate({price, destinations, dateStart, dateEnd}) {
  return (
    `<section class="trip-main__trip-info  trip-info">
       <div class="trip-info__main">
         <h1 class="trip-info__title">${destinations}</h1>
         <p class="trip-info__dates">${dateStart}&nbsp;&mdash;&nbsp;${dateEnd}</p>
       </div>
       <p class="trip-info__cost">
         Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
       </p>
     </section>`
  );
}

class Header extends AbstractView {
  #events = null;
  #destinations = null;

  constructor({events, destinations}) {
    super();
    this.#events = events;
    this.#destinations = destinations;
  }

  get template() {
    const dateStart = this.#calculateStartDate();
    const dateEnd = this.#calculateEndDate();
    return createHeaderTemplate({
      price: this.#calculatePrice(),
      destinations: this.#getDestinations(),
      dateStart,
      dateEnd
    });
  }

  #calculatePrice() {
    return this.#events.reduce((total, event) => total + event.price, 0);
  }

  #getDestinations() {
    if (this.#destinations.length === 0) {
      return '';
    }

    const names = this.#destinations.map((item) => item.name);
    if (names.length <= 3) {
      return names.join(' — ');
    }

    return `${names[0]} — ... — ${names[names.length - 1]}`;
  }

  #calculateStartDate() {
    if (this.#events.length === 0) {
      return '';
    }
    const dates = this.#events.map((event) => new Date(event.dateFrom).getTime());
    const minTime = Math.min(...dates);
    return formatDate(new Date(minTime), DATE_TYPE.MONTH);
  }

  #calculateEndDate() {
    if (this.#events.length === 0) {
      return '';
    }
    const dates = this.#events.map((event) => new Date(event.dateTo).getTime());
    const maxTime = Math.max(...dates);
    return formatDate(new Date(maxTime), DATE_TYPE.MONTH);
  }
}

export default Header;
