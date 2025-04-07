import AbstractView from '../framework/view/abstract-view';

function createHeaderTemplate({price, destinations}) {
  return (
    `<section class="trip-main__trip-info  trip-info">
       <div class="trip-info__main">
         <h1 class="trip-info__title">${destinations}</h1>
         <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
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
    return createHeaderTemplate({price: this.#calculatePrice(), destinations: this.#getDestinations()});
  }

  #calculatePrice() {
    return this.#events.reduce((total, event) => total + event.price, 0);
  }

  #getDestinations() {
    return this.#destinations.map((item) => item.name).join(' &mdash; ');
  }
}

export default Header;
