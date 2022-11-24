import {
  settings as s,
  interceptors as i,
  coreData as cd,
  coreConfig as cc,
  parsedConfig as pc,
} from '../store';
import { DateRange, SlaWorkTimeConfig } from '../types';
import { countDays, log, normalizeDate } from '../utils';

/**
 * Sets date to exclude from minute additions (For instance: holidays)
 *
 * @param skipDays - Array of dates to exclude from minute additions
 */
export const setSkipDays = (skipDays: DateRange[] = []) => {
  cd.SKIP_DAYS = skipDays
    .map(skipDay => {
      const mStart = normalizeDate(skipDay.startDate);
      const mEnd = skipDay.endDate ? normalizeDate(skipDay.endDate) : undefined;
      return {
        startDate: mStart,
        endDate: mEnd,
        count: mEnd ? countDays(mStart, mEnd) : 1,
      };
    })
    .sort((a, b) => a.startDate.valueOf() - b.startDate.valueOf());

  log('Skip days set to: ', cd.SKIP_DAYS);
};

/**
 * Configure the work hours and logs.
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

  pc.DAILY_WORK_MINS = (cc.END_PM - cc.START_AM) * 60;
  pc.WEEKLY_WORK_MINS = pc.DAILY_WORK_MINS * 5;
};
