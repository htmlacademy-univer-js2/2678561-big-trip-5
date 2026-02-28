/* eslint-disable camelcase */

import ApiService from '../framework/api-service.js';
import { Method } from '../const.js';

export default class PointsApiService extends ApiService {

  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse)
      .then((points) =>
        points.map(this.#adaptToClient)
      );
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsed = await ApiService.parseResponse(response);

    return this.#adaptToClient(parsed);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsed = await ApiService.parseResponse(response);

    return this.#adaptToClient(parsed);
  }

  async deletePoint(point) {
    await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE
    });
  }

  #adaptToClient(point) {
    return {
      ...point,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      price: point.base_price,
      isFavorite: point.is_favorite,

      date_from: undefined,
      date_to: undefined,
      base_price: undefined,
      is_favorite: undefined,
    };
  }

  #adaptToServer(point) {
    return {
      ...point,
      date_from: point.dateFrom,
      date_to: point.dateTo,
      base_price: point.price,
      is_favorite: point.isFavorite,

      dateFrom: undefined,
      dateTo: undefined,
      price: undefined,
      isFavorite: undefined,
    };
  }
}
