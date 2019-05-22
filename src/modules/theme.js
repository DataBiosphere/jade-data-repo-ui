import { createMuiTheme } from '@material-ui/core/styles';
import '../../fonts/Montserrat.css';
import '../style.css';
import WebFont from 'webfontloader';

export const easing = 'cubic-bezier(0.35, 0.01, 0.77, 0.34);';

WebFont.load({
  google: {
    families: ['Montserrat', 'sans-serif'],
  },
});

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
    common: {
      white: '#FFFFFF',
      selection: '#99CCFF',
    },
    primary: {
      main: '#81AB52',
      contrastText: '#FFFFFF',
      light: '#F1F4F7',
      dark: '#AEB3BA',
    },
    secondary: {
      main: '#74AE43',
      contrastText: '#8F96A1',
      dark: '#333F52',
    },
    error: {
      main: '#DB3214',
      contrastText: '#8F96A1',
      dark: '#BA250A',
    },
  },
  shape: {
    borderRadius: 5,
  },
});
