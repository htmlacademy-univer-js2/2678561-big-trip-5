import { pointsMock } from '../mock/points-mock.js';
import { destinationsMock } from '../mock/destinations-mock.js';
import { offersMock } from '../mock/offers-mock.js';
import Observable from '../framework/observable.js';

import { POINT_COUNT_DEFAULT } from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];

  constructor() {
    super();
    this.#points = this.#getRandomPoints(POINT_COUNT_DEFAULT);
    this.#destinations = destinationsMock;
    this.#offers = offersMock;
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

  #getRandomPoints(count) {
    return [...pointsMock]
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
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

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, updatedPoint);
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
