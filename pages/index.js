import { Grid } from '@material-ui/core';
import fetch from 'isomorphic-unfetch';
import PropTypes from 'prop-types';
import House from '../components/House';
import Layout from '../components/Layout';

const Index = ({ houses }) => (
  <Layout>
    <div>
      <h2>Places to stay</h2>
      <div className="houses">
        <Grid container spacing={2} justify="space-evenly">
          {houses.map((house, index) => (
            <House key={index} {...house} />
          ))}
        </Grid>
      </div>
    </div>
  </Layout>
);

Index.getInitialProps = async () => {
  const res = await fetch('http://localhost:3000/api/houses');
  const houses = await res.json();
  return { houses };
};

Index.propTypes = {
  houses: PropTypes.array.isRequired,
};

export default Index;
