import MainPresenter from './utils/mainPresenter';
import EventModel from './models/event-model';
import HeaderPresenter from './utils/headerPresenter';

const headerContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');

const eventModel = new EventModel();

const headerPresenter = new HeaderPresenter(headerContainer, eventModel);
const mainPresenter = new MainPresenter(eventsContainer, filterContainer, eventModel);

mainPresenter.init();
headerPresenter.init();
