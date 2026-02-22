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

  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return false;
  }

  return to >= from;
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
