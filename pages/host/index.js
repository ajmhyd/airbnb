import axios from 'axios';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout';

const Host = ({ houses, bookings }) => (
  <Layout>
    {houses.map((house, index) => (
      <div key={index}>
        <img src={house.picture} alt="House" />
        <div>
          <h2>
            {house.title} in {house.town}
          </h2>
          <p>
            <Link href={`/houses/${house.id}`}>
              <a>View house page</a>
            </Link>
          </p>
          <p>
            <Link href={`/host/${house.id}`}>
              <a>Edit house details</a>
            </Link>
          </p>
        </div>
      </div>
    ))}
    <h2>Your bookings</h2>
    {bookings.map((booking, index) => (
      <div key={index}>
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

Host.getInitialProps = async ctx => {
  const res = await axios({
    method: 'GET',
    url: 'http://localhost:3000/api/host/list',
    headers: ctx.req ? { cookie: ctx.res.headers.cookie } : undefined,
  });
  return { houses: res.data.houses, bookings: res.data.bookings };
};

Host.propTypes = {
  houses: PropTypes.array.isRequired,
  bookings: PropTypes.array.isRequired,
};

export default Host;
