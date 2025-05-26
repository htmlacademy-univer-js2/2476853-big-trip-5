import MainPresenter from './utils/main-presenter';
import EventModel from './models/event-model';
import FilterModel from './models/filter-model';
import FilterPresenter from './utils/filterPresenter';
import HeaderPresenter from './utils/header-presenter';
import TripApiService from './services/trip-api-service';

const AUTHORIZATION = 'Basic poewjsfhpv982l';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const headerContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');

const tripApiService = new TripApiService(END_POINT, AUTHORIZATION);
const eventModel = new EventModel({tripApiService});

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

eventModel.init();
