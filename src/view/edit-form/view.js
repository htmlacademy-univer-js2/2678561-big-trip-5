import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { createEditFormTemplate } from './templates/main-template.js';
import { isFormValid } from '../../utils/validate.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

export default class EditFormView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleCloseClick = null;
  #handleDeleteClick = null;
  #pointsModel = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #initialState = null;

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

    const initialState = {
      point: { ...point },
      destinations,
      offersByType,
    };

    this._state = initialState;
    this.#initialState = JSON.parse(JSON.stringify(initialState));

    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#pointsModel = pointsModel;

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state, isFormValid(
      this._state.point,
      this._state.destinations
    ));
  }

  reset(initialPoint) {
    if (initialPoint) {
      this.#initialState.point = { ...initialPoint };
    }

    this.updateElement(this.#initialState);
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeClickHandler);

    this.element.addEventListener('submit', this.#submitHandler);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);

    this.element
      .querySelector('#event-price')
      .addEventListener('input', this.#priceChangeHandler);

    this.#setTypeChangeHandlers();
    this.#setDestinationChangeHandler();
    this.#setOffersChangeHandlers();

    this.#initDatepickers();
    this.#updateSaveButtonState();
  }

  #updateSaveButtonState() {
    const isValid = isFormValid(this._state.point, this._state.destinations);
    const saveButton = this.element.querySelector('.event__save-btn');

    if (saveButton) {
      saveButton.disabled = !isValid;
    }
  }

  #initDatepickers() {
    const dateFromInput = this.element.querySelector('#event-start-time');
    const dateToInput = this.element.querySelector('#event-end-time');

    if (dateFromInput && !this.#datepickerFrom) {
      this.#datepickerFrom = flatpickr(dateFromInput, {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: dayjs(this._state.point.dateFrom).toDate(),
        onChange: this.#dateFromChangeHandler,
      });
    }

    if (dateToInput && !this.#datepickerTo) {
      this.#datepickerTo = flatpickr(dateToInput, {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: dayjs(this._state.point.dateTo).toDate(),
        minDate: dayjs(this._state.point.dateFrom).toDate(),
        onChange: this.#dateToChangeHandler,
      });
    }
  }

  #dateFromChangeHandler = (selectedDates) => {
    const newDateFrom = dayjs(selectedDates[0]).toISOString();

    this.updateElement({
      point: {
        ...this._state.point,
        dateFrom: newDateFrom,
      },
    });

    if (this.#datepickerTo) {
      this.#datepickerTo.set('minDate', newDateFrom);

      const currentDateTo = dayjs(this._state.point.dateTo);
      const newDateFromDayjs = dayjs(newDateFrom);

      if (currentDateTo.isBefore(newDateFromDayjs)) {
        const newDateTo = newDateFromDayjs.add(1, 'hour').toISOString();
        this.#dateToChangeHandler([dayjs(newDateTo).toDate()]);
      }
    }
  };

  #dateToChangeHandler = (selectedDates) => {
    const newDateTo = dayjs(selectedDates[0]).toISOString();

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
    const destinationInput = this.element.querySelector(
      '.event__input--destination',
    );
    if (destinationInput) {
      destinationInput.addEventListener('input', this.#destinationInputHandler);
      destinationInput.addEventListener(
        'change',
        this.#destinationChangeHandler,
      );
    }
  }

  #setOffersChangeHandlers() {
    const offerCheckboxes = this.element.querySelectorAll(
      '.event__offer-checkbox',
    );
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
    this.#updateSaveButtonState();
  };

  #destinationChangeHandler = (evt) => {
    const newDestinationName = evt.target.value;
    const currentPoint = this._state.point;
    const destinations = this._state.destinations;

    const selectedDestination = destinations.find(
      (d) => d.name === newDestinationName,
    );

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
    this.#updateSaveButtonState();
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
    this.#updateSaveButtonState();
  };

  #priceChangeHandler = (evt) => {
    const value = Number(evt.target.value);

    this._setState({
      point: {
        ...this._state.point,
        price: value,
      },
    });
    this.#updateSaveButtonState();
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#destroyDatepickers();
    this.#handleDeleteClick();
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    if (isFormValid(this._state.point, this._state.destinations)) {
      this.#handleFormSubmit(this._state.point);
    }
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
