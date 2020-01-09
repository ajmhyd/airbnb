import { Grid } from '@material-ui/core';
import Link from 'next/link';
import PropTypes from 'prop-types';

const House = ({ id, picture, rating, reviewsCount, title, type, town }) => (
  <Grid item sm={6}>
    <Link href="/houses/[id]" as={`/houses/${id}`}>
      <a>
        <img src={picture} width="100%" alt="House" />
        <p>
          {type} - {town}
        </p>
        <p>{title}</p>
        <p>
          {rating} ({reviewsCount})
        </p>
      </a>
    </Link>
  </Grid>
);

House.propTypes = {
  id: PropTypes.number.isRequired,
  picture: PropTypes.string.isRequired,
  rating: PropTypes.number,
  reviewsCount: PropTypes.number,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  town: PropTypes.string.isRequired,
};

export default House;
