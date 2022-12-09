import * as React from 'react';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import DatePicker, { Calendar, DateObject } from 'react-multi-date-picker';

import { parseTime } from './utils';
import { setSkipDays, addMinutes, configure, utils } from 'sla_work_time';

const HolidayCalendar = () => {
  const [errors, setErrors] = React.useState({ start: '' });
  const [logs, setLogs] = React.useState<string[]>([]);
  const [holidays, setHolidays] = React.useState<
    DateObject | DateObject[] | null
  >(null);
  const [finalValue, setFinalValue] = React.useState('');
  const [startDate, setStartDate] = React.useState(new Date());
  const [value, setValue] = React.useState({
    start: '09:00',
    end: '18:00',
    min: 0,
  });

  const startAM = parseTime(value.start);
  const endPM = parseTime(value.end);

  React.useEffect(() => {
    configure({
      log: true,
      displayFormat: 'ddd MMM Do, h:mm a',
      logger: (...params) => {
        const string = params.join(' ');
        setLogs(prev => [...prev, string]);
      },
    });
  }, []);

  const parsedHolidays =
    holidays && 'length' in holidays
      ? holidays.map((date: DateObject) => date.toString())
      : [];

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    setErrors({ start: '' });
    setValue(prev => ({ ...prev, [name]: value }));
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLogs([]);

    if (startAM >= endPM) {
      setErrors(prev => ({
        ...prev,
        start: 'Start time should be less than end time!',
      }));

      return;
    }

    configure({
      startAM,
      endPM,
    })
    setSkipDays(parsedHolidays);
    
    const newDate = addMinutes(startDate.toString(), value.min) || null;
    
    setErrors({ start: '' });
    setFinalValue(utils.formatDate(newDate, 'dddd MMM Do YYYY, h:mm a'));
  };

  return (
    <form className="container">
      <div className="calendar">
        <label className="custom-field one">Work hours:</label>
        <div className="time__field">
          <div className="field">
            <input
              type="time"
              name="start"
              className="time"
              value={value.start}
              onChange={onChange}
            />
          </div>
          <div className="middle">to</div>
          <div className="field">
            <input
              type="time"
              name="end"
              className="time"
              value={value.end}
              onChange={onChange}
            />
          </div>
        </div>
        {errors.start && <p className="error">{errors.start}</p>}

        <label className="custom-field one">Holidays:</label>
        <Calendar
          className="calendar"
          multiple
          value={holidays}
          sort
          onChange={date => setHolidays(date)}
          format="YYYY-MM-DD"
          plugins={[<DatePanel />]}
        />
      </div>

      <div className="input">
        <div className="input__field">
          <div className="field">
            <label className="custom-field one">Add minutes:</label>
            <DatePicker
              plugins={[<TimePicker />]}
              format="YYYY-MM-DD hh:mm:ss A"
              value={startDate}
              onChange={(dateObject: any) => setStartDate(dateObject)}
            />
          </div>

          <div className="add-symbol-container">
            <span className="add-symbol">+</span>
          </div>

          <div className="field">
            <div className="min_inp">
              <input
                name="min"
                value={value.min}
                type="number"
                min={0}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="button_container">
            <button
              disabled={!Boolean(value.min)}
              type="submit"
              className="button"
              onClick={onClick}
            >
              Add
            </button>
          </div>
        </div>

        {finalValue && (
          <p className="result">
            {' '}
            <span className="output_label">Final Result: </span>{' '}
            <span className="output">{finalValue} </span>{' '}
          </p>
        )}
      </div>

      <div className="logs">
        <p className="log_title">Calculation steps</p>
        {logs.length ? (
          <div className="log__list_container">
            {logs.map((log, idx) => (
              <span className="logs__list" key={idx}>
                {log}
              </span>
            ))}
          </div>
        ) : (
          <p className="log_fallback">Steps will populate here</p>
        )}
      </div>
    </form>
  );
};

export default HolidayCalendar;
