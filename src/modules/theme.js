import { createMuiTheme } from '@material-ui/core/styles';

export const headerHeight = 70;
export const appColor = '#7ebb7d';
export const easing = 'cubic-bezier(0.35, 0.01, 0.77, 0.34);';

export default createMuiTheme({
  typography: {
    color: '#333F52',
    useNextVariants: true,
    fontWeight: '400',
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
      main: '#81AB52',
      contrastText: '#FFFFFF',
      light: '#F1F4F7',
      dark: '#AEB3BA',
    },
    secondary: {
      main: '#81AB52',
      contrastText: '#8F96A1',
    },
    error: {
      main: '#DB3214',
      contrastText: '#8F96A1',
    },
  },
});
