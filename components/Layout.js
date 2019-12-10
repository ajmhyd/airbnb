import { Container } from '@material-ui/core';
import PropTypes from 'prop-types';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Header from './Header';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';

const useStyles = makeStyles(theme => ({
  main: {
    marginTop: theme.spacing(1),
  },
}));

const Layout = ({ children, title = 'airbnb' }) => {
  const classes = useStyles();
  const showLoginModal = useStoreState(state => state.modals.showLoginModal);
  const showRegistrationModal = useStoreState(
    state => state.modals.showRegistrationModal
  );
  const setShowRegistrationModal = useStoreActions(
    actions => actions.modals.setShowRegistrationModal
  );
  const setShowLoginModal = useStoreActions(
    actions => actions.modals.setShowLoginModal
  );
  const setHideModal = useStoreActions(actions => actions.modals.setHideModal);

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
      <LoginModal
        open={showLoginModal}
        showSignUp={() => setShowRegistrationModal()}
        close={() => setHideModal()}
      />
      <SignUpModal
        open={showRegistrationModal}
        showLogin={() => setShowLoginModal()}
        close={() => setHideModal()}
      />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default Layout;
