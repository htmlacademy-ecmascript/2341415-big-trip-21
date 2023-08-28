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

function getHours (date) {
  return dayjs(date).format('H');
}

function isPointExpired(dueDate) {
  return dueDate && dayjs().isAfter(dueDate, 'D');
}

export {getRandomArrayElement, humanizePointDueDate, isPointExpired, getRandomInteger, getHours};
