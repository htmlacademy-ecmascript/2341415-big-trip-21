import dayjs from 'dayjs';
import { subDays } from 'date-fns';
import { getRandomInteger } from '../utils.js';
import { DURATION } from '../const.js';

let date = subDays(new Date(), getRandomInteger(0, DURATION.DAY));

function getDate({next}) {
  if (next) {
    const minsGap = getRandomInteger(0, DURATION.MIN);
    const hoursGap = getRandomInteger(0, DURATION.HOUR);
    const daysGap = getRandomInteger(0, DURATION.DAY);

    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .add(daysGap, 'day')
      .toDate();
  }

  return date;
}

export {getDate};
