import {getRandomArrayElement, getRandomInteger } from '../utils.js';
import { POINT_TYPES, DESCRIPTIONS, PRICE, CITIES, OFFERS } from '../const.js';
import { getDate } from './utils.js';

function generateOffer() {
  return {
    id: crypto.randomUUID(),
    title: Object.values(OFFERS).at(getRandomInteger(0, OFFERS.length - 1)),
    price: getRandomInteger(PRICE.MIN, PRICE.MAX),
  };
}

function generatePictures(city) {
  return {
    src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
    description: `${city}${DESCRIPTIONS}`,
  };
}

function generateDestination(city) {
  const id = crypto.randomUUID();
  // const city = getRandomArrayElement(CITIES);
  const description = DESCRIPTIONS;

  return {
    id,
    city,
    description,
    pictures: Array.from({ length: getRandomInteger(1, 3) }, () => generatePictures(city))
    // pictures: [
    //   {
    //     src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
    //     description: `${city}${description}`,
    //   },
    //   {
    //     src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
    //     description: `${city}${description}`,
    //   },
    //   {
    //     src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
    //     description: `${city}${description}`,
    //   },
    //   {
    //     src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
    //     description: `${city}${description}`,
    //   }
    // ],
  };
}

function generatePointOptions(destinationId, pointType) {

  return {
    id: crypto.randomUUID(),
    basePrice:getRandomInteger(PRICE.MIN, PRICE.MAX),
    dateFrom: getDate({next: false}),
    dateTo: getDate({next: true}),
    destination: destinationId,
    isFavorite: false,
    type: pointType,
  };
}

function generatePoint() {
  const pointType = getRandomArrayElement(Object.values(POINT_TYPES));
  const offers = generateOffers();
  const destination = generateDestination(getRandomArrayElement(CITIES));
  const point = generatePointOptions(destination.id, pointType);

  return { offers, destination, point };
}

function generateList(length = getRandomInteger(1, 5), generateItem) {
  return Array.from({ length }, generateItem);
}

function generatePoints(length) {
  return generateList(length, generatePoint);
}

function generateOffers(length) {
  return generateList(length, generateOffer);
}

const points = generatePoints(6);
const cityDescriptions = CITIES.map((city) => generateDestination(city));

export { points, cityDescriptions };
