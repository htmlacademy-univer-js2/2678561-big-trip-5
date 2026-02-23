import dayjs from 'dayjs';

export const isPriceValid = (price) =>
  !isNaN(price) && price >= 0 && Number.isInteger(price) && price <= 1000000;

export const isDestinationValid = (destinationName, destinations) => {
  if (!destinationName || destinationName.trim() === '') {
    return false;
  }

  return destinations.some(
    (d) => d.name.toLowerCase() === destinationName.trim().toLowerCase()
  );
};

export const isDatesValid = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo) {
    return false;
  }

  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);

  if (!from.isValid() || !to.isValid()) {
    return false;
  }

  return to.isSame(from) || to.isAfter(from);
};

export const isFormValid = (point, destinations) => {
  const price = point.price || point.base_price;
  const destinationName = point.destinationName ||
    destinations.find((d) => d.id === point.destination)?.name || '';

  return (
    isPriceValid(price) &&
    isDestinationValid(destinationName, destinations) &&
    isDatesValid(point.dateFrom, point.dateTo)
  );
};
