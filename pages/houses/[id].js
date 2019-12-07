import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from '@material-ui/core';
import DateRangePicker from '../../components/DateRangePicker';
import houses from '../../data/houses.json';
import Layout from '../../components/Layout';

const House = ({ house }) => {
  const { title, picture, type, town, rating, reviewsCount, price } = house;
  const [dateChosen, setDateChosen] = useState(false);
  const [numberOfNightsBetweenDates, setNumberOfNightsBetweenDates] = useState(
    0
  );

  const calcNumberOfNightsBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate); // clone
    const end = new Date(endDate); // clone
    let dayCount = 0;

    while (end > start) {
      dayCount += 1;
      start.setDate(start.getDate() + 1);
    }

    return dayCount;
  };

  return (
    <Layout title={`${title} | airbnb`}>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={8}>
          <article>
            <img src={picture} width="100%" alt="House" />
            <p>
              {type} - {town}
            </p>
            <p>{title}</p>
            <p>
              {rating} ({reviewsCount})
            </p>
          </article>
        </Grid>
        <Grid item>
          <aside>
            <h2>Add dates for prices</h2>
            <DateRangePicker
              datesChanged={(startDate, endDate) => {
                setNumberOfNightsBetweenDates(
                  calcNumberOfNightsBetweenDates(startDate, endDate)
                );
                setDateChosen(true);
              }}
            />
            {dateChosen && (
              <div>
                <h2>Price per night</h2>
                <p>${price}</p>
                <h2>Total price for booking</h2>
                <p>${(numberOfNightsBetweenDates * price).toFixed(2)}</p>
                <Button variant="contained" color="primary">
                  Reserve
                </Button>
              </div>
            )}
          </aside>
        </Grid>
      </Grid>
    </Layout>
  );
};

House.getInitialProps = ({ query }) => {
  const { id } = query;
  return { house: houses.filter(house => house.id === id)[0] };
};

House.propTypes = {
  house: PropTypes.object.isRequired,
};
export default House;
