import { formatDate, formatTime, formatDuration } from './utils.js';

export function adaptPointToView(point, destination, offers) {
  return {
    id: point.id,
    type: point.type,
    destinationName: destination?.name ?? '',
    dateFrom: point.dateFrom,
    dateTo: point.dateTo,
    formattedDate: formatDate(point.dateFrom),
    formattedStartTime: formatTime(point.dateFrom),
    formattedEndTime: formatTime(point.dateTo),
    duration: formatDuration(point.dateFrom, point.dateTo),
    price: point.price,
    isFavorite: point.isFavorite,
    offers,
  };
}

export function getOffersForPoint(point, pointsModel) {
  return point.offers
    .map((id) => pointsModel.getOfferById(point.type, id))
    .filter(Boolean);
}

export function getAdaptedPointData(point, pointsModel) {
  const destination = pointsModel.getDestinationById(point.destination);
  const offers = getOffersForPoint(point, pointsModel);

  return adaptPointToView(point, destination, offers);
}
