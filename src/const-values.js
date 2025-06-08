const PointTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const DateType = {
  DAY_MONTH: 'D MMM',
  MONTH_DAY: 'MMM D',
  TIME: 'HH:mm',
  DATE_TIME: 'DD/MM/YY HH:mm',
  DATE: 'YYYY-MM-DD',
  DATE_TIME_ISO: 'YYYY-MM-DDTHH:mm',
};

const PointState = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

const UserAction = {
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ADD: 'ADD'
};

const UpdateType = {
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR',
  UPDATE: 'UPDATE',
};

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  DEFAULT: 'DEFAULT',
  DISABLED: 'DISABLED',
};

export {PointTypes, FilterTypes, DateType, PointState, UserAction, UpdateType, State};
