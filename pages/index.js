import { Grid } from '@material-ui/core';
import houses from '../data/houses.json';
import House from '../components/House';

const Index = () => (
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
);

export default Index;
