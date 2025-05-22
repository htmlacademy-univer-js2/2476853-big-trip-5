import MainPresenter from './utils/mainPresenter';
import EventModel from './models/event-model';
import FilterModel from './models/filter-model';
import FilterPresenter from './utils/filterPresenter';
import HeaderPresenter from './utils/headerPresenter';

const headerContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');

const eventModel = new EventModel();

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filterContainer, filterModel);
filterPresenter.init();

const headerPresenter = new HeaderPresenter(headerContainer, eventModel);
const mainPresenter = new MainPresenter(eventsContainer, eventModel, filterModel);

const newEventButton = document.querySelector('.trip-main__event-add-btn');
newEventButton.addEventListener('click', (e) => {
  e.preventDefault();
  mainPresenter.createEvent();
});

mainPresenter.init();
headerPresenter.init();
