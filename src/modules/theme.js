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
      link: '#4D72AA',
      selection: '#99CCFF',
    },
    primary: {
      main: '#81AB52',
      contrastText: '#FFFFFF',
      light: '#F1F4F7',
      lightContrast: '#D9DCDE',
      dark: '#727272',
      hover: '#8BB858',
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
  overrides: {
    MuiExpansionPanel: {
      root: {
        '&$expanded': {
          margin: '0px',
        },
      },
    },
    MuiExpansionPanelSummary: {
      root: {
        '&$expanded': {
          minHeight: 'inherit',
        },
      },
      content: {
        '&$expanded': {
          margin: 0,
        },
      },
    },
    // MuiListItemIcon: {
    //   root: {
    //     minWidth: '0px',
    //   },
    // },
  },
});
