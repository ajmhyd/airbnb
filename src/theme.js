import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FF5A5F',
      dark: '#484848',
    },
    secondary: {
      main: '#00A699',
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
