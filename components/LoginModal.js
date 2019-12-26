import { useState } from 'react';
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
import axios from 'axios';
import { useStoreActions } from 'easy-peasy';

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

const LoginModal = ({ open, showSignUp, close }) => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setUser = useStoreActions(actions => actions.user.setUser);
  const setHideModal = useStoreActions(actions => actions.modals.setHideModal);

  const submit = async () => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      if (response.data.status === 'error') {
        alert(response.data.message);
        return;
      }
      setUser(email);
      setHideModal();
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <Dialog onClose={close} aria-labelledby="simple-dialog-title" open={open}>
      {/* //TODO Turn into button */}
      <CloseIcon className={classes.close} />
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          Log in
        </Typography>

        <form
          className={classes.form}
          onSubmit={e => {
            e.preventDefault();
          }}
          id="login"
        >
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
            onChange={e => setEmail(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
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
            onClick={submit}
            form="login"
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
            <Button onClick={showSignUp}>
              <Typography color="secondary">Sign Up</Typography>
            </Button>
          </Grid>
        </form>
      </div>
    </Dialog>
  );
};

LoginModal.propTypes = {
  open: PropTypes.bool.isRequired,
  showSignUp: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default LoginModal;
