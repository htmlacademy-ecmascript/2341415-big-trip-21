import {FORM_DATE_FORMAT} from './const';
import dayjs from 'dayjs';
import { format, differenceInMinutes, differenceInDays } from 'date-fns';
import flatpickr from 'flatpickr';

const DATE_FORMAT = 'MMM d';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomArrayElements(items, count) {
  const start = getRandomInteger(0, items.length - count);
  return items.slice(start, start + count);
}

function getRandomInteger(a, b) {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function humanizePointDueDate(dueDate) {
  return dueDate ? format(dueDate, DATE_FORMAT) : '';
}

function getHours(date) {
  return dayjs(date).format('H');
}

function formatPoint(pointParams) {
  return {
    id: pointParams.id,
    offers: pointParams.offers,
    destination: pointParams.destination,
    type: pointParams.type,
    isFavorite: pointParams['is_favorite'],
    dateFrom: pointParams['date_from'],
    dateTo: pointParams['date_to'],
    basePrice: pointParams['base_price'],
  };
}

function isCheckId(type) {
  return type.toLowerCase().startsWith('check');
}

function typeToCammelCase(type) {
  return isCheckId(type) ? 'checkIn' : type.toLowerCase();
}

function typeToCebabCase(type) {
  return isCheckId(type) ? 'check-in' : type.toLowerCase();
}

function logFormData(formData) {
  for (const [key, value] of formData.entries()) {
    return [key, value];
  }
}

function clear(element) {
  element.innerHTML = '';
}

function hide(el) {
  el.classList.add('hidden');
}
const show = (el) => el.classList.remove('hidden');

function isExpired(dueDate) {
  return differenceInDays(new Date(), dueDate) > 0;
}

function isAfterToday(dueDate) {
  return differenceInDays(dueDate, new Date()) > 0;
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function sortDay(pointA, pointB) {
  return pointA.dateFrom.getTime() - pointB.dateTo.getTime();
}

function sortTime(pointA, pointB) {
  const durationA = differenceInMinutes(pointA.dateTo, pointA.dateFrom);
  const durationB = differenceInMinutes(pointB.dateTo, pointB.dateFrom);
  return durationB - durationA;
}

function sortPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function asyncronize(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), 0));
}

function extractPointParams(formData, state, isFavorite = false) {
  return {
    offers: state.selectedOfferIds ?? [],
    destination: state.destination?.id,
    'is_favorite': isFavorite,
    type: state.type,
    'date_from': flatpickr.parseDate(formData.get('event-start-time'), FORM_DATE_FORMAT),
    'date_to': flatpickr.parseDate(formData.get('event-end-time'), FORM_DATE_FORMAT),
    'base_price': formData.get('event-price'),
  };
}

function getRequestParamsFrom(point) {
  const { dateFrom, dateTo, basePrice, isFavorite, ...rest } = point;

  return {
    'is_favorite': isFavorite,
    'date_from': dateFrom,
    'date_to': dateTo,
    'base_price': basePrice,
    ...rest,
  };
}

export {
  asyncronize,
  getRandomArrayElement,
  humanizePointDueDate,
  getRandomInteger,
  getHours,
  logFormData,
  clear,
  hide,
  show,
  updateItem,
  sortTime,
  sortPrice,
  sortDay,
  isExpired,
  isAfterToday,
  getRandomArrayElements,
  formatPoint,
  extractPointParams,
  getRequestParamsFrom,
  typeToCammelCase,
  typeToCebabCase
};
