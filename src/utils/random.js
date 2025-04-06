const getRandomNumber = (min = 1, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomElement = (array) => array[getRandomNumber(0, array.length - 1)];

const getRandomBoolean = () => getRandomNumber(0, 1) === 1;

export {getRandomNumber, getRandomElement, getRandomBoolean};
