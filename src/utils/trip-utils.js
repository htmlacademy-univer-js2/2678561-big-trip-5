import dayjs from 'dayjs';

export function getRouteTitle(points, destinations) {
  if (!points.length) {
    return '';
  }

  const sortedByStart = [...points].sort(
    (a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom))
  );

  let firstPoint = points[0];
  let lastPoint = points[0];

  for (const point of points) {
    if (dayjs(point.dateFrom).isBefore(dayjs(firstPoint.dateFrom))) {
      firstPoint = point;
    }

    if (dayjs(point.dateTo).isAfter(dayjs(lastPoint.dateTo))) {
      lastPoint = point;
    }
  }

  const firstCity = destinations.find(
    (d) => d.id === firstPoint.destination
  )?.name;

  const lastCity = destinations.find(
    (d) => d.id === lastPoint.destination
  )?.name;

  const citiesInOrder = sortedByStart.map((point) =>
    destinations.find((d) => d.id === point.destination)?.name
  );

  const uniqueCities = [...new Set(citiesInOrder)];

  if (uniqueCities.length <= 3) {
    return uniqueCities.join(' — ');
  }

  return `${firstCity} — ... — ${lastCity}`;
}

export function getTripDates(points) {
  if (!points.length) {
    return '';
  }

  const startPoint = points.reduce((earliest, point) =>
    dayjs(point.dateFrom).isBefore(dayjs(earliest.dateFrom))
      ? point
      : earliest
  );

  const endPoint = points.reduce((latest, point) =>
    dayjs(point.dateTo).isAfter(dayjs(latest.dateTo))
      ? point
      : latest
  );

  const start = dayjs(startPoint.dateFrom).format('DD MMM').toUpperCase();
  const end = dayjs(endPoint.dateTo).format('DD MMM').toUpperCase();

  return `${start} — ${end}`;
}

export function getTotalPrice(points, offersByType) {
  return points.reduce((sum, point) => {
    const base = point.price || 0;

    const availableOffers =
      offersByType.find((o) => o.type === point.type)?.offers || [];

    const selectedOffersPrice = availableOffers
      .filter((offer) => point.offers.includes(offer.id))
      .reduce((acc, offer) => acc + (offer.price || 0), 0);

    return sum + base + selectedOffersPrice;
  }, 0);
}
