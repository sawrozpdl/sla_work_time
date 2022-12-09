import moment, { Moment } from 'moment';
import {
  WEEK as w,
  settings as s,
  interceptors as i,
  parsedConfig as pc,
} from '../store';
import { DateTime, DateProcessor, InputDate } from '../types';

/**
 * Log function wrapper.
 *
 * @param params
 */
export const log = (...params: any[]) => {
  if (s.LOG) {
    i.logger(...params);
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
    throw new Error(
      'Invalid date type, must be either of [Moment, Date, string]'
    );
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
export const formatDate = (date: InputDate, format = s.DISPLAY_FORMAT) => {
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

/**
 * Removes duplicate items from an array of objects.
 *
 * @param items Array of items to clean.
 * @param getUniqueKey Function to generate a unique key for each item.
 *
 * @returns List of unique items
 */
export const removeDuplicates = <T>(
  items: T[],
  getUniqueKey: (v: T) => string
) => {
  const existMap = new Map<string, boolean>();

  const newItems = [];

  for (const item of items) {
    const key = getUniqueKey(item);
    if (!existMap.has(key)) {
      existMap.set(key, false);
      newItems.push(item);
    }
  }

  return newItems;
};

/**
 * Converts a given array of dates to a date range.
 *
 * @param dates raw array of dates.
 * @param preSort  Wether to sort the dates.
 * @param removeDuplicate Wether to remove duplicate dates.
 */
export const toDateRange = (
  dates: InputDate[],
  preSort = true,
  removeDuplicate = true
) => {
  if (!dates.length) return [];

  let nDates = dates.map(normalizeDate);

  if (removeDuplicate) {
    nDates = removeDuplicates(nDates, d => d.format('YYYY-MM-DD'));
  }

  if (preSort) {
    nDates = nDates.sort((a, b) => a.diff(b));
  }

  const dateRanges = [];

  let startDate = nDates[0];
  let endDate = nDates[0];

  for (let i = 1; i < nDates.length; i++) {
    const d = nDates[i];

    if (d.diff(endDate, 'day') === 1) {
      endDate = d;
    } else {
      dateRanges.push({ startDate, endDate });
      startDate = d;
      endDate = d;
    }
  }

  dateRanges.push({ startDate, endDate });

  return dateRanges.map(range =>
    range.startDate.isSame(range.endDate, 'day')
      ? {
          startDate: range.startDate,
        }
      : range
  );
};
