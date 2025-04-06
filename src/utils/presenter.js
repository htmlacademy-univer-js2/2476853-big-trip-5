import {render} from '../render';
import EventList from '../view/event-list';
import Filters from '../view/filters';
import EventItem from '../view/event-item';
import Sort from '../view/sort';
import EditForm from '../view/edit-form';
import CreateForm from '../view/create-form';

class Presenter {
  eventListComponent = new EventList();

  constructor(eventsContainer, filterContainer, eventModel) {
    this.eventsContainer = eventsContainer;
    this.filterContainer = filterContainer;
    this.eventModel = eventModel;
  }

  init() {
    this.events = [...this.eventModel.getEvents()];
    this.offers = [...this.eventModel.getOffers()];

    render(new Filters(), this.filterContainer);
    render(new Sort(), this.eventsContainer);
    render(this.eventListComponent, this.eventsContainer);
    render(new EditForm({event: this.events[0], offers: this.offers}), this.eventListComponent.getElement());

    for (const element of this.events) {
      const eventOffers = this.offers.find((offer) => offer.type === element.type);
      render(new EventItem({event: element, offers: eventOffers}), this.eventListComponent.getElement());
    }

    render(new CreateForm(), this.eventListComponent.getElement());
  }
}

export default Presenter;
