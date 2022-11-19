import { setSkipDays, addMinutes, configure, utils } from '../src';

const testFormat = 'YYYY-MM-DDTHH:mm:ss';

const genericAddTestList = [
  {
    input: '2022-10-10T09:18:44',
    minutes: 3600,
    expected: '2022-10-18T15:18:44',
  },
  {
    input: '2022-10-07T16:18:44',
    minutes: 248,
    expected: '2022-10-10T11:26:00',
  },
  {
    input: '2022-10-08T16:18:44',
    minutes: 360,
    expected: '2022-10-10T14:30:00',
  },
  {
    input: '2022-10-11T05:18:44',
    minutes: 720,
    expected: '2022-10-12T11:30:00',
  },
];

const holidayTestList = [
  {
    input: '2022-11-24T16:18:44',
    minutes: 720,
    expected: '2022-12-01T10:18:00',
  },
  {
    input: '2022-11-29T16:18:44',
    minutes: 248,
    expected: '2022-12-01T12:38:00',
  },
  {
    input: '2022-11-28T16:18:44',
    minutes: 3600,
    expected: '2022-12-19T13:18:00',
  },
];

describe('Test addMinutes', () => {
  configure({
    // Testing as 8:30AM to 5:30PM work hours.
    startAM: 8.5,
    endPM: 17.5,
  });

  setSkipDays([
    // Add holidays
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

  it('Validates the day to working day', () => {
    expect(
      utils.viewDate(addMinutes('2019-01-01T00:00:00', 0), testFormat)
    ).toEqual('2019-01-01T08:30:00');
  });

  it('Add basic minutes to the date, considering weekends and work hours', () => {
    genericAddTestList.forEach(test => {
      expect(
        utils.viewDate(addMinutes(test.input, test.minutes), testFormat)
      ).toEqual(test.expected);
    });
  });

  it('Add minutes to the date, considering holidays', () => {
    holidayTestList.forEach(test => {
      expect(
        utils.viewDate(addMinutes(test.input, test.minutes), testFormat)
      ).toEqual(test.expected);
    });
  });
});
