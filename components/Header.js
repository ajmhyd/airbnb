import { AppBar, Toolbar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { useStoreActions } from 'easy-peasy';

const useStyles = makeStyles(theme => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  img: {
    flexGrow: 1,
    maxHeight: 40,
  },
  nav: {
    marginLeft: 'auto',
  },
  a: {
    color: theme.palette.primary.dark,
    textDecoration: 'none',
    margin: theme.spacing(1, 1.5),
  },
}));

const Header = () => {
  const classes = useStyles();
  const setShowLoginModal = useStoreActions(
    actions => actions.modals.setShowLoginModal
  );
  const setShowRegistrationModal = useStoreActions(
    actions => actions.modals.setShowRegistrationModal
  );
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      className={classes.appBar}
    >
      <Toolbar className={classes.toolbar}>
        <Link href="/">
          <Button>
            <img
              src="/img/logos/airbnblogo.png"
              alt="airbnb"
              className={classes.img}
            />
          </Button>
        </Link>
        <nav className={classes.nav}>
          <Button
            className={classes.a}
            onClick={() => setShowRegistrationModal()}
          >
            Sign Up
          </Button>
          <Button className={classes.a} onClick={() => setShowLoginModal()}>
            Log In
          </Button>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
