import moment, { Moment } from 'moment';
import { settings as s, parsedConfig as pc, WEEK as w } from '../store';
import { DateTime, DateProcessor, InputDate } from '../types';

/**
 * Log wrapper.
 *
 * @param params
 */
export const log = (...params: any[]) => {
  if (s.LOG) {
    console.log(...params);
  }
};

/**
 * Gets the date into a valid DateTime(Moment) format.
 *
 * @param date - Date to convert/Validate
 *
 * @returns a valid DateTime(Moment) date
 */
export const normalizeDate = (date: InputDate): DateTime => {
  if (date instanceof moment) {
    return (date as Moment).clone();
  } else if (
    date instanceof Date ||
    ['string', 'number'].includes(typeof date)
  ) {
    return moment(date);
  } else {
    throw new Error('Invalid date type, must be a Moment, Date, or string');
  }
};

/**
 * Returns a formatted date in asked format.
 *
 * @param date - Date to format
 * @param format - Format to use
 *
 * @returns a formatted date string.
 */
export const viewDate = (date: InputDate, format = 'MMM Do, h:mm a') => {
  return (date instanceof Date || typeof date === 'string'
    ? moment(date)
    : date
  ).format(format);
};

/**
 * Checks if the given date time is before the start of work hours.
 *
 * @param date - Date to check
 *
 * @returns the check result
 */
export const isBeforeStartAM = (date: DateTime) => {
  return (
    date.hour() < pc.START_AM_HR ||
    (date.hour() === pc.START_AM_HR && date.minute() < pc.START_AM_MIN)
  );
};

/**
 * Checks if the given date time is after the end of work hours.
 *
 * @param date - Date to check
 *
 * @returns the check result
 */
export const isAfterEndPM = (date: DateTime) => {
  return (
    date.hour() > pc.END_PM_HR ||
    (date.hour() === pc.END_PM_HR && date.minute() > pc.END_PM_MIN)
  );
};

/**
 * Counts the number of days that passes the given condition.
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param crit  - Condition to check
 *
 * @returns
 */
export const countDays = (
  startDate: DateTime,
  endDate: DateTime,
  crit: DateProcessor<Boolean> = () => true
) => {
  let count = 0;
  let date = startDate.clone();
  while (date.isSameOrBefore(endDate, 'day')) {
    if (crit(date)) {
      count++;
    }
    date.add(1, 'days');
  }
  return count;
};

/**
 * Counts weekends between the given date range.
 *
 * @param startDate - Start date
 * @param endDate - End date
 *
 * @returns the number of weekends in the given date range
 */
export const countWeekends = (startDate: DateTime, endDate: DateTime) => {
  return countDays(startDate, endDate, date =>
    [w.SAT, w.SUN].includes(date.day())
  );
};
