import dayjs from 'dayjs';
import { FilterType } from '../const';

export const isFuture = (point) =>
  dayjs(point.date_from).isAfter(dayjs(), 'minute');


export const isPast = (point) =>
  dayjs(point.date_to).isBefore(dayjs(), 'minute');

export const isPresent = (point) =>
  (
    dayjs(point.date_from).isBefore(dayjs(), 'minute') &&
    dayjs(point.date_to).isAfter(dayjs(), 'minute')
  );

export const filter = {

  [FilterType.EVERYTHING]: (points) => points,

  [FilterType.FUTURE]: (points) =>
    points.filter(isFuture),

  [FilterType.PRESENT]: (points) =>
    points.filter(isPresent),

  [FilterType.PAST]: (points) =>
    points.filter(isPast),

};
