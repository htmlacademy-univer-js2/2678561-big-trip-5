import dayjs from 'dayjs';
import { FilterType } from '../const';

export const isFuture = (point) =>
  dayjs(point.dateFrom).isAfter(dayjs(), 'minute');

export const isPast = (point) =>
  dayjs(point.dateTo).isBefore(dayjs(), 'minute');

export const isPresent = (point) =>
  dayjs(point.dateFrom).isBefore(dayjs(), 'minute') &&
  dayjs(point.dateTo).isAfter(dayjs(), 'minute');

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,

  [FilterType.FUTURE]: (points) => points.filter(isFuture),

  [FilterType.PRESENT]: (points) => points.filter(isPresent),

  [FilterType.PAST]: (points) => points.filter(isPast),
};
