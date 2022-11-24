import { ProcessedDateRange } from '../types';

export const settings = {
  LOG: false,
};

export const interceptors = {
  logger: console.log,
};

// Assuming work days are Monday through Friday and work hours are 8am to 5pm [Client set]
export const coreConfig = {
  START_AM: 8,
  END_PM: 17,
};

// For optimum calculations [Algo set]
export const parsedConfig = {
  START_AM_HR: 8,
  START_AM_MIN: 0,
  END_PM_HR: 17,
  END_PM_MIN: 0,
  DAILY_WORK_MINS: 540,
  WEEKLY_WORK_MINS: 2700,
};

// Skip days a.k.a Holidays. Needs to be in types.DateRange[] format.
export const coreData: { SKIP_DAYS: ProcessedDateRange[] } = {
  SKIP_DAYS: [],
};

// Indexed weeks
export const WEEK = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};
