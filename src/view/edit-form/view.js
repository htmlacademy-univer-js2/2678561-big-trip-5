import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { createEditFormTemplate } from './templates/main-template.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class EditFormView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleCloseClick = null;
  #handleDeleteClick = null;
  #pointsModel = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({
    point,
    destinations,
    offersByType,
    onFormSubmit,
    onCloseClick,
    onDeleteClick,
    pointsModel,
  }) {
    super();

    this._state = {
      point: { ...point },
      destinations,
      offersByType,
    };

    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#pointsModel = pointsModel;

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state);
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeClickHandler);

    this.element
      .addEventListener('submit', this.#submitHandler);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);

    this.#setTypeChangeHandlers();
    this.#setDestinationChangeHandler();
    this.#setOffersChangeHandlers();

    this.#initDatepickers();
  }

  #initDatepickers() {
    const dateFromInput = this.element.querySelector('#event-start-time');
    const dateToInput = this.element.querySelector('#event-end-time');

    if (dateFromInput && !this.#datepickerFrom) {
      this.#datepickerFrom = flatpickr(dateFromInput, {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateFrom,
        onChange: this.#dateFromChangeHandler,
      });
    }

    if (dateToInput && !this.#datepickerTo) {
      this.#datepickerTo = flatpickr(dateToInput, {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateTo,
        minDate: this._state.point.dateFrom,
        onChange: this.#dateToChangeHandler,
      });
    }
  }

  #dateFromChangeHandler = (selectedDates) => {
    const newDateFrom = selectedDates[0].toISOString();

    this.updateElement({
      point: {
        ...this._state.point,
        dateFrom: newDateFrom,
      },
    });

    if (this.#datepickerTo) {
      this.#datepickerTo.set('minDate', newDateFrom);

      const currentDateTo = new Date(this._state.point.dateTo);
      if (currentDateTo < new Date(newDateFrom)) {
        const newDateTo = new Date(new Date(newDateFrom).getTime() + 60 * 60 * 1000);
        this.#dateToChangeHandler([newDateTo], newDateTo.toISOString(), this.#datepickerTo);
      }
    }
  };

  #dateToChangeHandler = (selectedDates) => {
    const newDateTo = selectedDates[0].toISOString();

    this.updateElement({
      point: {
        ...this._state.point,
        dateTo: newDateTo,
      },
    });
  };

  #setTypeChangeHandlers() {
    const typeInputs = this.element.querySelectorAll('.event__type-input');
    typeInputs.forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });
  }

  #setDestinationChangeHandler() {
    const destinationInput = this.element.querySelector('.event__input--destination');
    if (destinationInput) {
      destinationInput.addEventListener('input', this.#destinationInputHandler);
      destinationInput.addEventListener('change', this.#destinationChangeHandler);
    }
  }

  #setOffersChangeHandlers() {
    const offerCheckboxes = this.element.querySelectorAll('.event__offer-checkbox');
    offerCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offersChangeHandler);
    });
  }

  #typeChangeHandler = (evt) => {
    const newType = evt.target.value;
    const currentPoint = this._state.point;

    const newOffersByType = this.#pointsModel.getOffersByType(newType);

    this.updateElement({
      point: {
        ...currentPoint,
        type: newType,
        offers: [],
      },
      offersByType: newOffersByType,
    });
  };

  #destinationInputHandler = (evt) => {
    const newDestinationName = evt.target.value;
    this._setState({
      point: {
        ...this._state.point,
        destinationName: newDestinationName,
      },
    });
  };

  #destinationChangeHandler = (evt) => {
    const newDestinationName = evt.target.value;
    const currentPoint = this._state.point;
    const destinations = this._state.destinations;

    const selectedDestination = destinations.find((d) => d.name === newDestinationName);

    if (selectedDestination) {
      this.updateElement({
        point: {
          ...currentPoint,
          destination: selectedDestination.id,
          destinationName: selectedDestination.name,
        },
      });
    } else {
      this._setState({
        point: {
          ...currentPoint,
          destinationName: newDestinationName,
        },
      });
    }
  };

  #offersChangeHandler = (evt) => {
    const offerId = evt.target.id.replace('event-offer-', '');
    const isChecked = evt.target.checked;

    const currentPoint = this._state.point;
    let updatedOffers;

    if (isChecked) {
      updatedOffers = [...currentPoint.offers, offerId];
    } else {
      updatedOffers = currentPoint.offers.filter((id) => id !== offerId);
    }

    this._setState({
      point: {
        ...currentPoint,
        offers: updatedOffers,
      },
    });

    evt.target.checked = isChecked;
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#destroyDatepickers();
    this.#handleCloseClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#destroyDatepickers();
    this.#handleDeleteClick();
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #destroyDatepickers() {
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  removeElement() {
    this.#destroyDatepickers();
    super.removeElement();
  }
}
