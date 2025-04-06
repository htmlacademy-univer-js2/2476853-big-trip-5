import {getRandomNumber} from '../utils/random';
import {POINT_TYPES} from "../const-values";

const createOffer = (id) => ({
  id: id,
  title: 'Upgrade',
  price: getRandomNumber(100, 1000)
});

const createOffers = () => {
  const mockOffers = [];
  for (const element of POINT_TYPES) {
    const currentOffer = {};
    currentOffer.type = element;

    const offers = [];

    for (let j = 0; j <= 3; j++) {
      offers.push(createOffer(j));
    }
    currentOffer.offers = offers;
    mockOffers.push(currentOffer);
  }
  return mockOffers;
};

export {createOffers};
