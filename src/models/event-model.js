import Observable from '../framework/observable';
import {createOffers} from '../mock-data/offers';
import {getRandomEvent} from '../mock-data/events';
import {getAllDestinations} from '../mock-data/destinations';

const EVENTS_LENGTH = 5;

class EventModel extends Observable {
  #offers = createOffers();
  #events = Array.from({length: EVENTS_LENGTH}, getRandomEvent);
  #destinations = getAllDestinations();

  get offers() {
    return this.#offers;
  }

  set offers(offers) {
    this.#offers = [...offers];
  }

  get destinations() {
    return this.#destinations;
  }

  set destinations(destinations) {
    this.#destinations = [...destinations];
  }

  get events() {
    return this.#events;
  }

  set events(events) {
    this.#events = [...events];
    this._notify('eventsChanged', this.#events);
  }

  addEvent(event) {
    this.#events = [event, ...this.#events];
    this._notify('eventsChanged', this.#events);
  }

  deleteEvent(eventId) {
    this.#events = this.#events.filter((event) => event.id !== eventId);
    this._notify('eventsChanged', this.#events);
  }

  updateEvent(updatedEvent) {
    this.#events = this.#events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    this._notify('eventsChanged', this.#events);
  }
}

export default EventModel;
