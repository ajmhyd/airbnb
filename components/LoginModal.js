import {
  Button,
  Checkbox,
  Dialog,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  close: {
    margin: theme.spacing(3),
  },
  form: {
    width: '90%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
  },
  forgot: {
    marginBottom: theme.spacing(1),
  },
  noAccount: {
    color: theme.palette.primary.dark,
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  signUp: {
    margin: theme.spacing(2, 0),
  },
}));

const LoginModal = ({ onClose, selectedValue, open }) => {
  const classes = useStyles();

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = value => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      //TODO Turn into button
      <CloseIcon className={classes.close} />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>

        <form className={classes.form} noValidate>
          <Divider />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Log In
          </Button>
          <Link href="#" variant="body2">
            <Typography
              color="secondary"
              align="center"
              className={classes.forgot}
            >
              Forgot password?
            </Typography>
          </Link>
          <Divider />
          <Grid container direction="row" className={classes.signUp}>
            <Typography className={classes.noAccount}>
              {' '}
              Don't have an account?&nbsp;&nbsp;
            </Typography>
            <Link href="#" variant="body2">
              <Typography color="secondary">Sign Up</Typography>
            </Link>
          </Grid>
        </form>
      </div>
    </Dialog>
  );
};

LoginModal.propTypes = {
  onClose: PropTypes.func,
};

export default LoginModal;
