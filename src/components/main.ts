import {
  log,
  formatDate,
  isAfterEndPM,
  countWeekends,
  normalizeDate,
  isBeforeStartAM,
} from '../utils';
import { DateTime, InputDate, DurationAddOptions } from '../types';
import { parsedConfig as pc, coreData as cd, WEEK as w } from '../store';

/**
 * Gets the date out of holiday (if it's in one)
 *
 * @param date - Date to jump out of holiday
 * @param initial - Whether or not this is the initial validation.
 *
 * @returns a new date that is not a holiday
 */
export const validateSkipDay = (date: DateTime, initial = true): DateTime => {
  let validated = date;
  let changed = false;
  for (let i = 0; i < cd.SKIP_DAYS.length; i++) {
    const skipDay = cd.SKIP_DAYS[i];

    if (date.isBefore(skipDay.startDate, 'day')) {
      continue;
    } else if (
      skipDay.endDate &&
      date.isBetween(skipDay.startDate, skipDay.endDate, undefined, '[]')
    ) {
      changed = true;
      validated = skipDay.endDate.clone().add(1, 'day');
      break;
    } else if (date.isSame(skipDay.startDate, 'day')) {
      changed = true;
      validated = validated.add(1, 'day');
      break;
    }
  }

  if (changed) {
    if (initial) {
      validated = validated
        .hour(pc.START_AM_HR)
        .minute(pc.START_AM_MIN)
        .second(0);
    }
    log('Holiday detected, validate jumped to: ', formatDate(validated));
  }

  return changed ? toNextWorkTime(validated, false) : validated;
};

/**
 * Gets the given date back to valid work day and hours if it's not
 *
 * @param date - Date to validate/refactor
 * @param initial - Whether or not this is the initial validation.
 *
 * @returns a new date that is a valid work day with valid working hours
 */
export const toNextWorkTime = (date: DateTime, initial = true) => {
  let startDate = date;
  let changed = false;

  if ([w.SAT, w.SUN].includes(startDate.day())) {
    changed = true;
    startDate = startDate.add(startDate.day() === w.SAT ? 2 : 1, 'days');

    if (initial) {
      startDate = startDate
        .hour(pc.START_AM_HR)
        .minute(pc.START_AM_MIN)
        .second(0);
    }

    log('Weekends detected, validate jumped to : ', formatDate(startDate));
  } else if (initial && isBeforeStartAM(startDate)) {
    changed = true;
    startDate = startDate
      .hour(pc.START_AM_HR)
      .minute(pc.START_AM_MIN)
      .second(0);
    log('Before start AM, jumped to : ', formatDate(startDate));
  } else if (initial && isAfterEndPM(startDate)) {
    changed = true;
    startDate = startDate
      .add(startDate.day() === w.FRI ? 3 : 1, 'days') // Add 3 days if Friday, 1 day otherwise
      .hour(pc.START_AM_HR)
      .minute(pc.START_AM_MIN)
      .second(0);

    log('After end PM, jumped to : ', formatDate(startDate));
  }

  return initial || changed ? validateSkipDay(startDate, initial) : startDate;
};

/**
 * Adds back any holidays that may have been between the provided and resulting date.
 *
 * @param initialDate - Given date to add duration to
 * @param finalDate - Resulting date after duration addition (Before holiday consideration)
 *
 * @returns a new date with holidays in range added back in
 */
const addHolidayOffset = (
  initialDate: DateTime,
  finalDate: DateTime
): DateTime => {
  let validated = finalDate;
  let changed = false;

  let isFinalInBetween;
  for (let i = 0; i < cd.SKIP_DAYS.length; i++) {
    const skipDay = cd.SKIP_DAYS[i];
    // initialDate can't be a holiday as we pre-validated.

    if (finalDate.isBefore(skipDay.startDate, 'day')) {
      continue;
    } else if (
      skipDay.endDate &&
      ((isFinalInBetween = finalDate.isBetween(
        skipDay.startDate,
        skipDay.endDate,
        undefined,
        '[]'
      )) ||
        (initialDate.isBefore(skipDay.startDate, 'day') &&
          finalDate.isAfter(skipDay.endDate, 'day')))
    ) {
      // Remove pre validated holidays between skipStartDate and finalDate
      validated = finalDate.add(
        skipDay.count -
          countWeekends(
            skipDay.startDate,
            isFinalInBetween ? finalDate : skipDay.endDate
          ),
        'days'
      );
      changed = true;
      log(
        'Holiday range in bound, jumped to: ',
        formatDate(validated),
        `(${i})`
      );
    } else if (
      // initialDate can't be a skipDay but finalDate could be
      skipDay.startDate.isBetween(initialDate, finalDate, undefined, '(]')
    ) {
      validated = finalDate.add(1, 'days');
      changed = true;
      log('1 holiday in between, jumped to: ', formatDate(validated));
    }
  }

  return changed ? toNextWorkTime(validated, false) : validated;
};

/**
 * Add minutes to a date considering work hours, week ends and holidays.
 *
 * @param date - The date to add minutes to.
 * @param minutes - The number of minutes to add.
 * @param options - Configurable options.
 *
 * @returns The date with the added minutes.
 */
export const addMinutes = (
  date: InputDate,
  minutes: number,
  options: DurationAddOptions = {}
): DateTime | Date => {
  const {
    workHours = true,
    holidayOffset = true,
    toNativeDate = true,
  } = options;

  let startDate = normalizeDate(date);

  log(`Adding ${minutes} minutes`, 'to: ', formatDate(startDate));

  if (!workHours) {
    const final = startDate.add(minutes, 'minutes');

    return toNativeDate ? final.toDate() : final;
  }

  startDate = toNextWorkTime(startDate);

  const givenDate = startDate.clone();

  const workWeekCount = Math.floor(minutes / pc.WEEKLY_WORK_MINS);
  const remainingWeekMinuteToAdd = minutes % pc.WEEKLY_WORK_MINS;

  if (workWeekCount > 0) {
    startDate = startDate.add(workWeekCount, 'weeks');

    log(
      `Jumped ${workWeekCount} weeks to: ` + formatDate(startDate),
      `(Remaining : ${remainingWeekMinuteToAdd} minutes)`
    );
  }

  const workDayCount = Math.floor(
    remainingWeekMinuteToAdd / pc.DAILY_WORK_MINS
  );
  const remainingDayMinutesToAdd =
    remainingWeekMinuteToAdd % pc.DAILY_WORK_MINS;

  if (workDayCount > 0) {
    const currDay = startDate.day(); // 1 <-> 5
    let weekendOffset = 0;
    if (currDay + workDayCount > w.FRI) weekendOffset = 2;

    startDate = startDate.add(workDayCount + weekendOffset, 'days');

    log(
      `Jumped ${workDayCount} days to: ` + formatDate(startDate),
      `(Remaining : ${remainingDayMinutesToAdd} minutes)`
    );
  }

  // Minutes passed since the beginning of the work day.
  const workMinutePassed =
    (startDate.hour() - pc.START_AM_HR) * 60 +
    (startDate.minute() - pc.START_AM_MIN);

  // Minutes left in the work day.
  const remainingWorkMinutes = pc.DAILY_WORK_MINS - workMinutePassed;

  if (remainingDayMinutesToAdd >= remainingWorkMinutes) {
    // Jump to the next work day
    startDate = startDate
      .add(startDate.day() === w.FRI ? 3 : 1, 'days')
      .hour(pc.START_AM_HR)
      .minute(
        pc.START_AM_MIN + (remainingDayMinutesToAdd - remainingWorkMinutes)
      )
      .second(0);

    log(`Jumped to next working day to: ` + formatDate(startDate));
  } else {
    startDate = startDate.add(remainingDayMinutesToAdd, 'minutes');
  }

  log(
    'Semi final: ',
    formatDate(startDate),
    ', Now considering holidays (If any in bound)'
  );

  const result = holidayOffset
    ? addHolidayOffset(givenDate, startDate)
    : startDate;

  log('Final result: ', formatDate(result));

  return toNativeDate ? result.toDate() : result;
};

/**
 * Add hours to a date considering work hours, week ends and holidays.
 *
 * @param date - The date to add hours to.
 * @param hours - The number of hours to add.
 * @param options - Configurable options.
 *
 * @returns The date with the added hours.
 */
export const addHours = (
  date: InputDate,
  hours: number,
  options: DurationAddOptions = {}
): DateTime | Date => {
  // Got a bit lazy here, but it's alright.
  return addMinutes(date, hours * 60, options);
};
