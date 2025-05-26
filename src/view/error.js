import AbstractView from '../framework/view/abstract-view.js';

const errorTemplate = () => '<p class="trip-events__msg">Failed to load latest route information</p>';

export default class ErrorView extends AbstractView {
  get template() {
    return errorTemplate();
  }
}
