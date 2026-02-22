export const POINT_COUNT_DEFAULT = 2;

export const SORT_TYPES = [
  { type: 'day', isDisabled: false },
  { type: 'event', isDisabled: true },
  { type: 'time', isDisabled: false },
  { type: 'price', isDisabled: false },
  { type: 'offers', isDisabled: true },
];

export const FILTER_TYPES = [
  { type: 'everything', isChecked: true },
  { type: 'future', isChecked: false },
  { type: 'present', isChecked: false },
  { type: 'past', isChecked: false },
];

export const EVENT_TYPES = [
  'taxi', 'bus', 'train', 'ship', 'drive',
  'flight', 'check-in', 'sightseeing', 'restaurant'
];

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const EmptyPointsText = {
  everything: 'Click New Event to create your first point',
  past: 'There are no past events now',
  present: 'There are no present events now',
  future: 'There are no future events now',
};
