import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from '@material-ui/core';
import fetch from 'isomorphic-unfetch';
import { useStoreActions, useStoreState } from 'easy-peasy';
import DateRangePicker from '../../components/DateRangePicker';
import Layout from '../../components/Layout';

const House = ({ house }) => {
  const { title, picture, type, town, reviewsCount, reviews, price } = house;
  const [dateChosen, setDateChosen] = useState(false);
  const [numberOfNightsBetweenDates, setNumberOfNightsBetweenDates] = useState(
    0
  );
  const setShowLoginModal = useStoreActions(
    actions => actions.modals.setShowLoginModal
  );
  const user = useStoreState(state => state.user.user);

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

  const reserve = async () => {
    // todo
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
            {reviewsCount ? (
              <div className="reviews">
                <h3>{reviewsCount} Reviews</h3>
                {reviews.map((review, index) => (
                  <div key={index}>
                    <p>{new Date(review.createdAt).toDateString()}</p>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
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
                {user ? (
                  <Button variant="contained" color="primary" onClick={reserve}>
                    Reserve
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowLoginModal()}
                  >
                    Log in to Reserve
                  </Button>
                )}
              </div>
            )}
          </aside>
        </Grid>
      </Grid>
    </Layout>
  );
};

House.getInitialProps = async ({ query }) => {
  const { id } = query;
  const res = await fetch(`http://localhost:3000/api/houses/${id}`);
  const house = await res.json();
  return { house };
};

House.propTypes = {
  house: PropTypes.object.isRequired,
};
export default House;
