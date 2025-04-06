import Presenter from './utils/presenter';
import EventModel from './models/event-model';

const eventsContainer = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');

const eventModel = new EventModel();

const presenter = new Presenter(eventsContainer, filterContainer, eventModel);
presenter.init();
