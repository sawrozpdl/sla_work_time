<h2 align='center'>
 SLA work time [0.0.2] (Beta)
</h2>

<h3 align='center'>
A time management(addition/validation) algorithm with work hours and skip day considerations. [powered by momentjs]
</h3>

---

<p align="center">
  <a href="https://www.npmjs.com/package/sla_work_time">
    <img alt= "NPM" src="https://img.shields.io/npm/v/sla_work_time.svg">
  </a>
  <a href="https://standardjs.com">
    <img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg">
  </a>
  <a href="https://github.com/sawrozpdl/sla_work_time/actions?query=workflow%3A%22Node.js+CI%22">
    <img alt="Github Actions CI Status" src="https://github.com/sawrozpdl/sla_work_time/actions/workflows/main.yml/badge.svg">
  </a>
  <a href="https://codeclimate.com/github/sawrozpdl/sla_work_time/maintainability">
    <img alt= "Maintainability" src="https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability">
  </a>
</p>

[View demo](https://sawrozpdl.github.io/sla_work_time)

## Installation

```bash
npm i sla_work_time
```

or

```bash
yarn add sla_work_time
```

## Usage

```tsx
import { setSkipDays, addMinutes, configure, utils } from 'sla_work_time';

configure({
  // Setting work hours as 8:30AM to 5:30PM
  startAM: 8.5,
  endPM: 17.5,
});

setSkipDays([
  // Add DISTINCT holidays/days to exclude in { startDate, endDate (optional) } format.
  {
    startDate: '2022-11-25',
  },
  {
    startDate: '2022-11-29',
    endDate: '2022-11-30',
  },
  {
    startDate: '2022-12-02',
    endDate: '2022-12-12',
  },
]);

const newDate = addMinutes('2022-11-28T16:18:44', 3600);

console.log(utils.formatDate(newDate, 'YYYY-MM-DDTHH:mm:ss')); // 2022-12-19T13:18:00
```

**<p style="text-align: center;">! NOTE !</p>**

```
The function `setSkipDays` is supposed to be called periodically (yearly/monthly) to update the skip days(eg. add/update new holidays) which should be handled in the service layer. this can be implemented with either an ETL job or an API that injects holidays into the system memory.
````


### Available methods

---

| Method                   | Params                                                 | Description                                                         |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------- |
| addMinutes \|\| addHours | (date, minutes \|\| hours, config: DurationAddOptions) | Adds duration to the date following the config options.             |
| toNextWorkTime           | (date: DateTime, fixTime: Boolean = true)              | Gets the given date back to valid work day and hours if it's not    |
| validateSkipDay          | (date: DateTime, fixTime: Boolean = true)              | Gets the date out of holiday (if it's in one)                       |
| configure                | (config: { startAM, endPM })                           | Sets the work hours for any day.                                    |
| setSkipDays              | (skipDays: [{ startDate, endDate }])                   | Sets date to exclude from minute additions (For instance: holidays) |

---

## Description

These exposed functions add durations to a date considering work hours, week ends and skip days(holidays). For example, adding 25 minutes to the date `Friday 05:55PM` would result in `Monday 09:20AM` for [Mon-Fri] & [9AM - 6PM] work hour settings.

## Contributing

---

Fee free to open a pull request with detailed title/description about the feature.

For reporting any bug/issues make sure to add a detailed bug reproduction process(a sandbox link if possible) in the description.

## License

MIT © [sawrozpdl](https://github.com/sawrozpdl)
