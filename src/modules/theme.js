import { createMuiTheme } from '@material-ui/core/styles';

export const headerHeight = 70;
export const appColor = '#7ebb7d';
export const easing = 'cubic-bezier(0.35, 0.01, 0.77, 0.34);';

export default createMuiTheme({
  typography: {
    useNextVariants: true,
    fontWeight: '300',
    fontFamily: [
      'Montserrat',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#81ab52',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#74ae43',
      contrastText: '#8F96A1',
    },
  },
});
