import dayjs from 'dayjs';
import { format } from 'date-fns';
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

export {getRandomArrayElement, humanizePointDueDate, getRandomInteger, getHours, logFormData, clear, hide, show };
