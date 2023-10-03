const POINT_TYPES = {
  taxi: 'Taxi',
  bus: 'Bus',
  train: 'Train',
  ship: 'Ship',
  drive: 'Drive',
  flight: 'Flight',
  checkIn: 'Check-in',
  sightseeing: 'Sightseeing',
  restaurant: 'Restaurant'
};

const DURATION = {
  HOUR: 5,
  DAY: 5,
  MIN: 50,
  hoursInDay: 24,
  minInHour: 60,
};

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

const FORM_DATE_FORMAT = 'd/m/Y h:i';

const HOST = 'https://21.objects.pages.academy/big-trip';
const AUTH_HEADERS = { Authorization: 'Basic 123qwe' };

const MIN_PRICE = 1;
const MAX_PRICE = 10000;

export {
  POINT_TYPES,
  DURATION,
  FILTERTYPE,
  SORT_TYPE,
  FORM_DATE_FORMAT,
  HOST,
  AUTH_HEADERS,
  MIN_PRICE,
  MAX_PRICE
};
