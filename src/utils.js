import dayjs from 'dayjs';
import { format, differenceInMinutes, differenceInDays } from 'date-fns';

const DATE_FORMAT = 'MMM d';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const getRandomInteger = (a, b) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function humanizePointDueDate(dueDate) {
  return dueDate ? format(dueDate, DATE_FORMAT) : '';
}

function getHours(date) {
  return dayjs(date).format('H');
}


function logFormData(formData) {
  for (const [key, value] of formData.entries()) {
    // console.log(key, ': ', value);
    return [key, value];
  }
}

function clear(element) {
  element.innerHTML = '';
}

// const getUnique = (arr) => {
//   const uniqueValues = [];

//   for (const it of arr) {
//     if (!uniqueValues.includes(it)) {
//       uniqueValues.push(it);
//     }
//   }

//   return uniqueValues;
// };

// const debounce = (callback, timeoutDelay) => {
//   let timeoutId;
//   return (...rest) => {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
//   };
// };

function hide(el) {
  el.classList.add('hidden');
}
const show = (el) => el.classList.remove('hidden');

// const disable = (el) => {
//   el.disabled = true;
// };

// const enable = (el) => {
//   el.disabled = false;
// };
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
  return pointA.point.dateFrom.getTime() - pointB.point.dateTo.getTime();
}

function sortTime(pointA, pointB) {
  const durationA = differenceInMinutes(pointA.point.dateTo, pointA.point.dateFrom);
  const durationB = differenceInMinutes(pointB.point.dateTo, pointB.point.dateFrom);
  return durationB - durationA;
}

function sortPrice(pointA, pointB) {
  return pointB.point.basePrice - pointA.point.basePrice;
}

export {getRandomArrayElement, humanizePointDueDate, getRandomInteger, getHours, logFormData, clear, hide, show, updateItem, sortTime, sortPrice, sortDay, isExpired, isAfterToday };
