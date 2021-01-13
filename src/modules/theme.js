import { createMuiTheme } from '@material-ui/core/styles';
import '../media/fonts/Montserrat.css';
import '../style.css';
import WebFont from 'webfontloader';

export const easing = 'cubic-bezier(0.35, 0.01, 0.77, 0.34);';

WebFont.load({
  google: {
    families: ['Montserrat', 'sans-serif', 'Lato'],
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
    bold: '600',
    h1: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    h2: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    h3: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '1.3125rem',
      lineHeight: 1.524,
      letterSpacing: 0,
    },
    h5: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
      fontSize: '0.875rem',
      lineHeight: 1.714,
      letterSpacing: 0,
    },
    body1: {
      fontFamily: 'Montserrat',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.714,
      letterSpacing: 0,
    },
  },
  palette: {
    common: {
      white: '#FFFFFF',
      link: '#4D72AA',
      selection: '#99CCFF',
    },
    primary: {
      main: '#81ab52',
      contrastText: '#FFFFFF',
      light: '#F1F4F7',
      lightContrast: '#D9DCDE',
      dark: '#727272',
      hover: '#8BB858',
      focus: 'rgba(0,0,0,0.04)',
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
