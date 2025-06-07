import MainPresenter from './presenters/main-presenter';
import EventModel from './models/event-model';
import FilterModel from './models/filter-model';
import FilterPresenter from './presenters/filter-presenter';
import HeaderPresenter from './presenters/header-presenter';
import TripApiService from './services/trip-api-service';

const AUTHORIZATION = 'Basic poewjsfhpv982l';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const headerContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const tripApiService = new TripApiService(END_POINT, AUTHORIZATION);
const eventModel = new EventModel({tripApiService});
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(filterContainer, filterModel, eventModel);
const headerPresenter = new HeaderPresenter(headerContainer, eventModel);
const mainPresenter = new MainPresenter(eventsContainer, eventModel, filterModel, newEventButton);

newEventButton.addEventListener('click', (e) => {
  e.preventDefault();
  mainPresenter.createEvent();
});

filterPresenter.init();
mainPresenter.init();
headerPresenter.init();
eventModel.init();
