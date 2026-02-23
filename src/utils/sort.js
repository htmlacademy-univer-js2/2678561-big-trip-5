import dayjs from 'dayjs';
import { SortType } from '../const.js';

export const sortPointsBy = (points, sortType) => {
  const sortedPoints = [...points];

  switch (sortType) {
    case SortType.TIME:
      return sortedPoints.sort((a, b) => {
        const durationA = dayjs(a.dateTo).diff(dayjs(a.dateFrom));
        const durationB = dayjs(b.dateTo).diff(dayjs(b.dateFrom));
        return durationB - durationA;
      });

    case SortType.PRICE:
      return sortedPoints.sort((a, b) => b.price - a.price);

    case SortType.DAY:
    default:
      return sortedPoints.sort((a, b) =>
        dayjs(a.dateFrom).diff(dayjs(b.dateFrom)),
      );
  }
};
