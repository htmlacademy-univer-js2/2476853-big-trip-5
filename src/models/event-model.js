import {createOffers} from '../mock-data/offers';
import {getRandomEvent} from '../mock-data/events';
import {getAllDestinations} from '../mock-data/destinations';

const EVENTS_LENGTH = 5;

class EventModel {
  #offers = createOffers();
  #events = Array.from({length: EVENTS_LENGTH}, getRandomEvent);
  #destinations = getAllDestinations();

  get offers() {
    return this.#offers;
  }

  get events() {
    return this.#events;
  }

  get destinations() {
    return this.#destinations;
  }

  updateEvent(updatedEvent) {
    this.#events = this.#events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
  }
}

export default EventModel;
