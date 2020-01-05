import DayPickerInput from 'react-day-picker/DayPickerInput';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import { DateUtils } from 'react-day-picker';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

const format = 'dd MMM yyyy';
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const parseDate = (str, format, locale) => {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  return DateUtils.isDate(parsed) ? parsed : null;
};

const formatDate = (date, format, locale) =>
  dateFnsFormat(date, format, { locale });

const numberOfNightsBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate); // clone
  const end = new Date(endDate); // clone
  let dayCount = 0;

  while (end > start) {
    dayCount += 1;
    start.setDate(start.getDate() + 1);
  }

  return dayCount;
};

const DateRangePicker = ({ datesChanged, bookedDates }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  bookedDates = bookedDates.map(date => new Date(date));

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/react-day-picker/lib/style.css"
        />
      </Head>
      <div>
        <label>From:</label>
        <DayPickerInput
          formatDate={formatDate}
          format={format}
          value={startDate}
          parseDate={parseDate}
          placeholder={`${dateFnsFormat(new Date(), format)}`}
          dayPickerProps={{
            modifiers: {
              disabled: [
                ...bookedDates,
                {
                  before: new Date(),
                },
              ],
            },
          }}
          onDayChange={day => {
            setStartDate(day);
            const newEndDate = new Date(day);
            if (numberOfNightsBetweenDates(day, endDate) < 1) {
              newEndDate.setDate(newEndDate.getDate() + 1);
              setEndDate(newEndDate);
            }
            datesChanged(day, newEndDate);
          }}
        />
      </div>
      <div>
        <label>To:</label>
        <DayPickerInput
          formatDate={formatDate}
          format={format}
          value={endDate}
          parseDate={parseDate}
          placeholder={`${dateFnsFormat(new Date(), format)}`}
          dayPickerProps={{
            modifiers: {
              disabled: [
                startDate,
                ...bookedDates,
                {
                  before: startDate,
                },
              ],
            },
          }}
          onDayChange={day => {
            setEndDate(day);
            datesChanged(startDate, day);
          }}
        />
      </div>
    </>
  );
};

DateRangePicker.propTypes = {
  datesChanged: PropTypes.bool.isRequired,
  bookedDates: PropTypes.array.isRequired,
};

export default DateRangePicker;
