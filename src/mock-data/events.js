import {getRandomBoolean, getRandomElement, getRandomNumber} from '../utils/random';
import {getRandomDestinationId} from './destinations';
import {POINT_TYPES} from '../const-values';

const getRandomEvent = () => ({
  id: getRandomNumber(1, 100),
  price: getRandomNumber(100, 10000),
  dateFrom: new Date(Date.now() + getRandomNumber(-1000000000, 0)),
  dateTo: new Date(Date.now() + getRandomNumber(1, 1000000000)),
  cityDestination: getRandomDestinationId(),
  isFavorite: getRandomBoolean(),
  offers: [1, 2, 3],
  type: getRandomElement(POINT_TYPES)
});

export {getRandomEvent};
