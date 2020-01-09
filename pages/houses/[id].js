import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from '@material-ui/core';
import fetch from 'isomorphic-unfetch';
import { useStoreActions, useStoreState } from 'easy-peasy';
import axios from 'axios';
import DateRangePicker from '../../components/DateRangePicker';
import Layout from '../../components/Layout';

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

const getBookedDates = async houseId => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/houses/booked',
      {
        houseId,
      }
    );
    if (response.data.status === 'error') {
      alert(response.data.message);
      return;
    }
    return response.data.dates;
  } catch (error) {
    console.error(error);
  }
};

const canReserve = async (houseId, startDate, endDate) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/houses/check',
      { houseId, startDate, endDate }
    );
    if (response.data.status === 'error') {
      alert(response.data.message);
      return;
    }

    if (response.data.message === 'busy') return false;
    return true;
  } catch (error) {
    console.error(error);
  }
};

const House = ({ house, bookedDates }) => {
  const {
    title,
    picture,
    type,
    town,
    reviewsCount,
    reviews,
    price,
    id,
  } = house;
  const [dateChosen, setDateChosen] = useState(false);
  const [numberOfNightsBetweenDates, setNumberOfNightsBetweenDates] = useState(
    0
  );
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const setShowLoginModal = useStoreActions(
    actions => actions.modals.setShowLoginModal
  );
  const user = useStoreState(state => state.user.user);

  const reserve = async () => {
    if (!(await canReserve(id, startDate, endDate))) {
      alert('The dates chosen are not valid');
      return;
    }
    try {
      const sessionResponse = await axios.post('/api/stripe/session', {
        amount: price * numberOfNightsBetweenDates,
      });
      if (sessionResponse.data.status === 'error') {
        alert(sessionResponse.data.message);
        return;
      }

      const { sessionId } = sessionResponse.data;
      const { stripePublicKey } = sessionResponse.data;

      const reserveResponse = await axios.post('/api/houses/reserve', {
        houseId: house.id,
        startDate,
        endDate,
        sessionId,
      });

      if (reserveResponse.data.status === 'error') {
        alert(reserveResponse.data.message);
        return;
      }

      const stripe = Stripe(stripePublicKey);
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });
      console.log(reserveResponse.data);
    } catch (error) {
      console.log(error);
    }
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
                setStartDate(startDate);
                setEndDate(endDate);
              }}
              bookedDates={bookedDates}
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

  const bookedDates = await getBookedDates(id);
  return { house, bookedDates };
};

House.propTypes = {
  house: PropTypes.object.isRequired,
  bookedDates: PropTypes.array.isRequired,
};
export default House;
