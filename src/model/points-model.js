import Observable from '../framework/observable.js';

import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #apiService = null;
  #points = [];
  #destinations = [];
  #offers = [];

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#apiService.points,
        this.#apiService.destinations,
        this.#apiService.offers,
      ]);

      this.#points = points;
      this.#destinations = destinations;
      this.#offers = offers;

    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }

  getDestinationById(id) {
    return this.#destinations.find((d) => d.id === id);
  }

  getOffersByType(type) {
    const offerGroup = this.#offers.find((group) => group.type === type);
    return offerGroup ? offerGroup.offers : [];
  }

  getOfferById(type, offerId) {
    return this.getOffersByType(type).find((offer) => offer.id === offerId);
  }

  setPoints(updateType, points) {
    this.#points = [...points];
    this._notify(updateType);
  }

  async updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    const response = await this.#apiService.updatePoint(updatedPoint);

    this.#points = [
      ...this.#points.slice(0, index),
      response,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, response);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    this.#points = this.#points.filter((point) => point.id !== update);
    this._notify(updateType);
  }

}
