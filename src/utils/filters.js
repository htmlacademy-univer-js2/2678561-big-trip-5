import dayjs from 'dayjs';

export const isFuture = (point) =>
  dayjs(point.date_from).isAfter(dayjs(), 'minute');


export const isPast = (point) =>
  dayjs(point.date_to).isBefore(dayjs(), 'minute');

export const isPresent = (point) =>
  (
    dayjs(point.date_from).isBefore(dayjs(), 'minute') &&
    dayjs(point.date_to).isAfter(dayjs(), 'minute')
  );
