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

const OFFERS = {
  addLuggage: 'Add luggage',
  switchToComfortClass: 'Switch to comfort class',
  addMeal: 'Add meal',
  chooseSeats: 'Choose seats',
  travelByTrain: 'Travel by train',
};

const POINT_TYPE_OFFERS = {
  [POINT_TYPES.taxi.toLowerCase()]: [{id: crypto.randomUUID(), title: OFFERS.addLuggage, price: 181}],
  [POINT_TYPES.bus.toLowerCase()]:[{id: crypto.randomUUID(), title: OFFERS.addLuggage, price: 181}],
  [POINT_TYPES.train.toLowerCase()]: [{id: crypto.randomUUID(), title: OFFERS.addLuggage, price: 181}],
  [POINT_TYPES.ship.toLowerCase()]: [{id: crypto.randomUUID(), title: OFFERS.addLuggage, price: 181}],
  [POINT_TYPES.drive.toLowerCase()]: [{id: crypto.randomUUID(), title: OFFERS.addLuggage, price: 181}, {id: crypto.randomUUID(), title: OFFERS.addMeal, price: 181}],
  [POINT_TYPES.flight.toLowerCase()]: [{id: crypto.randomUUID(), title: OFFERS.addLuggage, price: 181},{id: crypto.randomUUID(), title: OFFERS.addMeal, price: 181}],
  [POINT_TYPES.checkIn.toLowerCase()]: [{id: crypto.randomUUID(), title: OFFERS.addLuggage, price: 181},{id: crypto.randomUUID(), title: OFFERS.addMeal, price: 181}],
  [POINT_TYPES.sightseeing.toLowerCase()]: [{id: crypto.randomUUID(), title: OFFERS.addLuggage, price: 181},{id: crypto.randomUUID(), title: OFFERS.addMeal, price: 181}],
  [POINT_TYPES.restaurant.toLowerCase()]: [{id: crypto.randomUUID(), title: OFFERS.addLuggage, price: 181},{id: crypto.randomUUID(), title: OFFERS.addMeal, price: 181}],
};

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

const FORM_DATE_FORMAT = 'd/m/Y h:i';

export { POINT_TYPES, DESCRIPTIONS, DURATION, PRICE, CITIES, OFFERS, FILTERTYPE, SORT_TYPE, POINT_TYPE_OFFERS, FORM_DATE_FORMAT };
