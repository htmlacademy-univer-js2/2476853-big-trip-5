import {render} from '../render';
import EventList from '../view/event-list';
import Filters from '../view/filters';
import EventItem from '../view/event-item';
import Sort from '../view/sort';
import EditForm from '../view/edit-form';
import CreateForm from '../view/create-form';

class Presenter {
  eventListComponent = new EventList();

  constructor() {
    this.eventsContainer = document.querySelector('.trip-events');
    this.filterContainer = document.querySelector('.trip-controls__filters');
  }

  init() {
    render(new Filters(), this.filterContainer);
    render(new Sort(), this.eventsContainer);
    render(this.eventListComponent, this.eventsContainer);
    render(new EditForm(), this.eventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventItem(), this.eventListComponent.getElement());
    }

    render(new CreateForm(), this.eventListComponent.getElement());
  }
}

export default Presenter;
