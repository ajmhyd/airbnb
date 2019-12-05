import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import DateRangePicker from '../../components/DateRangePicker';
import houses from '../../data/houses.json';
import Layout from '../../components/Layout';

const House = ({ house }) => {
  const { title, picture, type, town, rating, reviewsCount } = house;
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
            <DateRangePicker />
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
