import { Container } from '@material-ui/core';
import PropTypes from 'prop-types';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';

const useStyles = makeStyles(theme => ({
  main: {
    marginTop: theme.spacing(1),
  },
}));

const Layout = ({ children, title = 'airbnb' }) => {
  const classes = useStyles();
  return (
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
      <Container maxWidth="xl" className={classes.main}>
        {children}
      </Container>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default Layout;
