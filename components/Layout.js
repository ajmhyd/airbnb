import { Container } from '@material-ui/core';
import PropTypes from 'prop-types';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './Header';

const Layout = ({ children, title = 'airbnb' }) => (
  <>
    <CssBaseline />
    <Head>
      <title>{title}</title>
    </Head>
    <header>
      <nav>
        <Header />
      </nav>
    </header>
    <Container maxWidth="xl">{children}</Container>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default Layout;
