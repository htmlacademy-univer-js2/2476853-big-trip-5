const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const DATE_TYPE = {
  MONTH: 'MMM D',
  TIME: 'HH:mm',
  DATE: 'DD/MM/YY HH:mm'
};

const POINT_STATE = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

const USER_ACTION = {
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ADD: 'ADD'
};

export {POINT_TYPES, FILTER_TYPES, DATE_TYPE, POINT_STATE, USER_ACTION};
