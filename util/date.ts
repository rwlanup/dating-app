import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const getYearsBetweenDate = (startDate: Date | Dayjs, endDate: Date | Dayjs = dayjs()): string => {
  const parsedStartDate = dayjs.isDayjs(startDate) ? startDate : dayjs(startDate);
  let parsedEndDate = dayjs.isDayjs(endDate) ? endDate : dayjs(endDate);

  parsedEndDate = parsedEndDate.subtract(parsedStartDate.year(), 'years');
  parsedEndDate = parsedEndDate.subtract(parsedStartDate.month(), 'months');
  parsedEndDate = parsedEndDate.subtract(parsedStartDate.day(), 'days');

  const year = parsedEndDate.year();
  if (year > 1) return `${year} years`;
  return `${year} year`;
};

export const getFormattedDate = (date: Date | Dayjs): string => {
  return dayjs(date).format('DD MMMM, YYYY');
};

export const getRelativeTime = (date: Date | Dayjs): string => {
  return dayjs(date).fromNow();
};
