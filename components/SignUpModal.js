import {
  Button,
  Dialog,
  Divider,
  Grid,
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

const SignUpModal = ({ open, showLogin, close }) => {
  const classes = useStyles();

  return (
    <Dialog onClose={close} aria-labelledby="simple-dialog-title" open={open}>
      {/* //TODO Turn into button */}
      <CloseIcon className={classes.close} />
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          Sign Up
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Enter password again"
            type="password2"
            id="passwordconfirmation"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Divider />
          <Grid container direction="row" className={classes.signUp}>
            <Typography className={classes.noAccount}>
              {' '}
              Already have an airbnb account?&nbsp;&nbsp;
            </Typography>
            <Button onClick={showLogin}>
              <Typography color="secondary">Log in</Typography>
            </Button>
          </Grid>
        </form>
      </div>
    </Dialog>
  );
};

SignUpModal.propTypes = {
  open: PropTypes.bool.isRequired,
  showLogin: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default SignUpModal;
