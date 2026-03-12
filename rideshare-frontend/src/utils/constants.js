// constants.js - Application-wide constants

export const API_BASE_URL = 'http://localhost:8080/api';

export const RIDE_STATUS = {
  CREATED: 'CREATED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

export const USER_ROLES = {
  PASSENGER: 'PASSENGER',
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
};
