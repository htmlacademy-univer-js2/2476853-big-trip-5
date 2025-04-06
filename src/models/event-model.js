import {createOffers} from '../mock-data/offers';
import {getRandomEvent} from '../mock-data/events';

const EVENTS_LENGTH = 5;

class EventModel {
  offers = createOffers();
  events = Array.from({length: EVENTS_LENGTH}, getRandomEvent);

  getOffers = () => this.offers;

  getEvents = () => this.events;
}

export default EventModel;
