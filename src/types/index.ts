import { Moment } from 'moment';

// Using Moment as base DateTime interface. (as of now)
export type DateTime = Moment;

export type InputDate = string | Date | DateTime;

export interface DateRange {
  startDate: string | Date | DateTime;
  endDate?: string | Date | DateTime;
}

// Adds a count between the start and end date.
export interface ProcessedDateRange {
  startDate: DateTime;
  endDate?: DateTime;
  count: number;
}

// App wise configuration for work hours.
export interface SlaWorkTimeConfig {
  startAM?: number;
  endPM?: number;
  log?: boolean;
}

// Configurable options for time addition.
export interface DurationAddOptions {
  workHours?: boolean;
  holidayOffset?: boolean;
  toNativeDate?: boolean;
}

// Processor function that takes a date and returns <T>
export type DateProcessor<T> = (date: DateTime) => T;
