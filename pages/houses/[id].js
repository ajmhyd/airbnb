import Head from 'next/head';
import houses from '../../data/houses.json';

const House = ({ house }) => (
  <div>
    <Head>
      <title>{house.title}</title>
    </Head>
    <img src={house.picture} width="100%" alt="House" />
    <p>
      {house.type} - {house.town}
    </p>
    <p>{house.title}</p>
    <p>
      {house.rating} ({house.reviewsCount})
    </p>
  </div>
);

House.getInitialProps = ({ query }) => {
  const { id } = query;
  return { house: houses.filter(house => house.id === id)[0] };
};

export default House;
