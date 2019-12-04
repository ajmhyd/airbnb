import { AppBar, Toolbar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';

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
          <Link href="/register">
            <a className={classes.a}>Sign Up</a>
          </Link>
          <Link href="/login">
            <a className={classes.a}>Log In</a>
          </Link>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
