const POINT_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant'
];

const OFFERS = [
  'Add luggage',
  'Switch to comfort',
  'Switch to comfort',
  'Choose seats',
  'Travel by train'
];

const DESCRIPTIONS = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.';

const DURATION = {
  HOUR: 5,
  DAY: 5,
  MIN: 50,
  hoursInDay: 24,
  minInHour: 60,
};

const PRICE = {
  MIN: 1,
  MAX: 1000,
};

const CITIES = [
  'Amsterdam',
  'Kito',
  'Lima',
  'Saint-Petrburg',
  'Ndjamena',
  'Katmandu',
  'Boston'
];

const FILTERTYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SORT_TYPE = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export { POINT_TYPES, DESCRIPTIONS, DURATION, PRICE, CITIES, OFFERS, FILTERTYPE, SORT_TYPE };
