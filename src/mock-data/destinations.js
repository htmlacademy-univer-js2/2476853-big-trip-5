import {getRandomElement, getRandomNumber} from '../utils/random';

const mockDestinations = [
  {
    id: 1,
    description: 'Cool city from Deus Ex: Mankind Divided',
    name: 'Prague',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: 'Prague'
      }
    ]
  },
  {
    id: 2,
    description: 'Best city in da worl',
    name: 'Moscow',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: 'Moscow'
      }
    ]
  },
  {
    id: 3,
    description: 'URFU TOP, RTF CHAMPION, KONTUR TOP, KOLTSOVO yoooo',
    name: 'Yekaterinburg',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: 'Yekaterinburg'
      }
    ]
  }
];

const getRandomDestination = () => getRandomElement(mockDestinations);

export {getRandomDestination};
