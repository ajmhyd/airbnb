import PropTypes from 'prop-types';
import houses from '../../data/houses.json';
import Layout from '../../components/Layout';

const House = ({ house }) => {
  const { title, picture, type, town, rating, reviewsCount } = house;
  return (
    <Layout title={`${title} | airbnb`}>
      <img src={picture} width="100%" alt="House" />
      <p>
        {type} - {town}
      </p>
      <p>{title}</p>
      <p>
        {rating} ({reviewsCount})
      </p>
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
