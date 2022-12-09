import {
  settings as s,
  interceptors as i,
  coreData as cd,
  coreConfig as cc,
  parsedConfig as pc,
} from '../store';
import { DateRange, InputDate, SlaWorkTimeConfig } from '../types';
import { countDays, log, normalizeDate, toDateRange } from '../utils';

/**
 * Sets date to exclude from minute additions (For instance: holidays)
 *
 * @param skipDays - Array of dates to exclude from minute additions
 * @param shouldSort - Should the skip days be sorted by startDate
 */
export const setSkipDays = (
  skipDays: DateRange[] | InputDate[] = [],
  shouldSort = true
) => {
  const ranged = typeof skipDays[0] === 'object' && 'startDate' in skipDays[0];

  const _skipDays = ranged ? skipDays : toDateRange(skipDays as InputDate[]);

  let totalCount = 0;
  let processedSkipDays = (_skipDays as DateRange[]).map(skipDay => {
    const startDate = normalizeDate(skipDay.startDate);
    const endDate = skipDay.endDate
      ? normalizeDate(skipDay.endDate)
      : undefined;
    const count = endDate ? countDays(startDate, endDate) : 1;
    totalCount += count;

    return {
      startDate,
      endDate,
      count,
    };
  });

  if (ranged && shouldSort)
    processedSkipDays = processedSkipDays.sort(
      (a, b) => a.startDate.valueOf() - b.startDate.valueOf()
    );

  cd.SKIP_DAYS = processedSkipDays;

  log(`Loaded ${totalCount} skip days into the memory`);
};

/**
 * Configure the work hours and generic settings.
 *
 * @param config - SlaWorkTimeConfig
 */
export const configure = (config: SlaWorkTimeConfig) => {
  if (config.startAM) {
    cc.START_AM = config.startAM;
    pc.START_AM_HR = +cc.START_AM.toString().split('.')[0];
    pc.START_AM_MIN = (cc.START_AM - pc.START_AM_HR) * 60;
  }

  if (config.endPM) {
    cc.END_PM = config.endPM;
    pc.END_PM_HR = +cc.END_PM.toString().split('.')[0];
    pc.END_PM_MIN = (cc.END_PM - pc.END_PM_HR) * 60;
  }

  if (config.log) {
    s.LOG = config.log;
  }

  if (config.logger) {
    i.logger = config.logger;
  }

  if (config.displayFormat) {
    s.DISPLAY_FORMAT = config.displayFormat;
  }

  if (config.startAM || config.endPM) {
    pc.DAILY_WORK_MINS = (cc.END_PM - cc.START_AM) * 60;
    pc.WEEKLY_WORK_MINS = pc.DAILY_WORK_MINS * 5;
  }
};
