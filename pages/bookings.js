import axios from 'axios';
import Layout from '../components/Layout';

const Bookings = ({ bookings }) => (
  <Layout>
    {bookings.map((booking, index) => (
      <div key={index}>
        <img src={booking.house.picture} alt="House" />
        <div>
          <h2>
            {booking.house.title} in {booking.house.town}
          </h2>
          <p>
            Booked from {new Date(booking.booking.startDate).toDateString()} to{' '}
            {new Date(booking.booking.endDate).toDateString()}
          </p>
        </div>
      </div>
    ))}
  </Layout>
);

Bookings.getInitialProps = async ctx => {
  const response = await axios({
    method: 'get',
    url: 'http://localhost:3000/api/bookings/list',
    headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined,
  });

  return {
    bookings: response.data,
  };
};

export default Bookings;
