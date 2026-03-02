import { render, remove } from '../framework/render.js';
import TripInfoView from '../view/trip-info/view.js';
import { getRouteTitle, getTripDates, getTotalPrice } from '../utils/trip-utils.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #tripInfoComponent = null;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleModelChange);
  }

  init() {
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    const points = this.#pointsModel.points;
    const destinations = this.#pointsModel.destinations;
    const offers = this.#pointsModel.offers;

    if (points.length === 0) {
      if (this.#tripInfoComponent) {
        remove(this.#tripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    const route = getRouteTitle(points, destinations);
    const dates = getTripDates(points);
    const totalPrice = getTotalPrice(points, offers);

    const prevComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      route,
      dates,
      totalPrice
    });

    if (!prevComponent) {
      render(this.#tripInfoComponent, this.#container);
    } else {
      prevComponent.element.replaceWith(this.#tripInfoComponent.element);
      remove(prevComponent);
    }
  }

  #handleModelChange = () => {
    this.#renderTripInfo();
  };
}
