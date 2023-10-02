import {getRandomArrayElement, getRandomInteger, getRandomArrayElements} from '../utils.js';
import { POINT_TYPES, DESCRIPTIONS, PRICE, CITIES, OFFERS } from '../const.js';
import { getDate } from './utils.js';

const POINT_TYPE_LIST = Object.keys(POINT_TYPES);
const OFFER_TITLES = Object.values(OFFERS);

function generateOffer(title) {
  return {
    id: crypto.randomUUID(),
    title: title ?? OFFER_TITLES.at(getRandomInteger(0, OFFERS.length - 1)),
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
  return {
    id: crypto.randomUUID(),
    name: city,
    description: DESCRIPTIONS,
    pictures: Array.from({ length: getRandomInteger(1, 3) }, () => generatePictures(city))
  };
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

const destinations = CITIES.map((city) => generateDestination(city));

const offers = POINT_TYPE_LIST.map((type) => ({
  type,
  offers: getRandomArrayElements(OFFER_TITLES, getRandomInteger(1, 5)).map((title) => generateOffer(title)),
}));

function generatePoint() {
  const type = getRandomArrayElement(POINT_TYPE_LIST);
  const offerIds = offers.find((offer) => offer.type === type).offers.map((offer) => offer.id);
  const selectedOffersCount = getRandomInteger(0, offerIds.length);
  const selectedOfferIds = getRandomArrayElements(offerIds, selectedOffersCount);

  return {
    id: crypto.randomUUID(),
    basePrice:getRandomInteger(PRICE.MIN, PRICE.MAX),
    dateFrom: getDate({next: false}),
    dateTo: getDate({next: true}),
    destination: getRandomArrayElement(destinations).id,
    isFavorite: false,
    type,
    offers: selectedOfferIds
  };
}

const points = generatePoints(6);

export { points, destinations, offers, generateDestination, generateOffers, getRandomInteger };
