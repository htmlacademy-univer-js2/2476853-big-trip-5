import Observable from '../framework/observable';
import {convertToClient} from '../utils/adapter';
import {UpdateType} from '../const-values';

class EventModel extends Observable {
  #tripApiService = null;
  #offers = [];
  #events = [];
  #destinations = [];
  #isLoading = true;
  #isError = false;

  constructor({tripApiService}) {
    super();
    this.#tripApiService = tripApiService;
  }

  get isLoading() {
    return this.#isLoading;
  }

  get isError() {
    return this.#isError;
  }

  async init() {
    try {
      this.#isLoading = true;
      this.#isError = false;
      this._notify(UpdateType.LOADING);

      const [points, destinations, offers] = await Promise.all([
        this.#tripApiService.points,
        this.#tripApiService.destinations,
        this.#tripApiService.offers,
      ]);

      this.#events = points.map(convertToClient.point);
      this.#destinations = destinations.map(convertToClient.destination);
      this.#offers = offers.map(convertToClient.offer);

      this.#isLoading = false;
      this._notify(UpdateType.LOADED);
    } catch (error) {
      this.#isLoading = false;
      this.#isError = true;
      this._notify(UpdateType.ERROR);
    }
  }

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
    this._notify(UpdateType.UPDATE, this.#events);
  }

  async updateEvent(updatedEvent) {
    const response = await this.#tripApiService.updatePoint(updatedEvent);
    const adaptedEvent = convertToClient.point(response);

    this.#events = this.#events.map((event) =>
      event.id === adaptedEvent.id ? adaptedEvent : event
    );
    this._notify(UpdateType.UPDATE, this.#events);
    return adaptedEvent;
  }

  async createEvent(newEvent) {
    const response = await this.#tripApiService.addPoint(newEvent);
    const adaptedEvent = convertToClient.point(response);

    this.#events = [adaptedEvent, ...this.#events];
    this._notify(UpdateType.UPDATE, this.#events);
    return adaptedEvent;
  }

  async removeEvent(event) {
    await this.#tripApiService.deletePoint(event);

    this.#events = this.#events.filter((item) => item.id !== event.id);
    this._notify(UpdateType.UPDATE, this.#events);
  }
}

export default EventModel;
