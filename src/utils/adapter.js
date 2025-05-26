const convertToClient = {
  point: (point) => ({
    id: point.id,
    price: point.base_price,
    dateFrom: point.date_from !== null ? new Date(point.date_from) : point.date_from,
    dateTo: point.date_to !== null ? new Date(point.date_to) : point.date_to,
    cityDestination: point.destination,
    isFavorite: point.is_favorite,
    offers: point.offers,
    type: point.type,
  }),

  destination: (destination) => ({
    id: destination.id,
    description: destination.description,
    name: destination.name,
    pictures: destination.pictures,
  }),

  offer: (offer) => ({
    type: offer.type,
    offers: offer.offers,
  }),
};

const convertToServer = {
  point: (point) => ({
    'id': point.id,
    'base_price': point.price,
    'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : point.dateFrom,
    'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : point.dateTo,
    'destination': point.cityDestination,
    'is_favorite': point.isFavorite,
    'offers': point.offers,
    'type': point.type,
  })
};

export {convertToServer, convertToClient};
