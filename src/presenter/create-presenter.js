import { render, remove } from '../framework/render.js';
import CreateFormView from '../view/create-form/view.js';
import { UserAction, UpdateType } from '../const.js';

export default class CreatePresenter {
  #container = null;
  #pointsModel = null;
  #createFormComponent = null;
  #onDataChange = null;

  constructor({ container, pointsModel, onDataChange }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#onDataChange = onDataChange;
  }

  init() {
    if (this.#createFormComponent !== null) {
      return;
    }

    this.#createFormComponent = new CreateFormView({
      destinations: this.#pointsModel.destinations,
      offersByType: this.#pointsModel.getOffersByType('flight'),
      onSubmit: this.#handleSubmit,
      onCancel: this.#handleCancel,
      pointsModel: this.#pointsModel,
    });

    render(this.#createFormComponent, this.#container, 'afterbegin');
  }

  destroy() {
    if (this.#createFormComponent === null) {
      return;
    }

    remove(this.#createFormComponent);
    this.#createFormComponent = null;
  }

  #handleSubmit = (point) => {
    this.#onDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );

    this.destroy();
  };

  #handleCancel = () => {
    this.destroy();
  };

  isCreating() {
    return this.#createFormComponent !== null;
  }
}
