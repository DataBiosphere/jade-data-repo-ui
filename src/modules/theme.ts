import { createTheme } from '@mui/material/styles';
import '../media/fonts/Montserrat.css';
import '../style.css';
import WebFont from 'webfontloader';

export const easing = 'cubic-bezier(0.35, 0.01, 0.77, 0.34);';

WebFont.load({
  google: {
    families: ['Montserrat', 'sans-serif', 'Lato'],
  },
});

// Copied from Terra UI
const baseColors = {
  primary: '#4d72aa',
  secondary: '#6d6e70',
  accent: '#4d72aa',
  success: '#74ae43',
  warning: '#f7981c',
  danger: '#db3214',
  light: '#e9ecef',
  dark: '#333f52',

  // Added by TDR
  primaryDark: '#718EBB',
  successDark: '#338800',
  dangerDark: '#BA250A',
};

const WHITE = '#FFFFFF';
const LINK = baseColors.primary;
const LINK_HOVER = baseColors.primaryDark;

const theme = createTheme({
  typography: {
    color: baseColors.dark,
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
      white: WHITE,
      link: LINK,
      linkHover: LINK_HOVER,
      selection: '#99CCFF',
      border: '#AEB3BA',
      selectedTextBackground: '#F1F4F8',
    },
    lightTable: {
      cellBackgroundDark: 'rgba(233,236,239,0.4)',
      callBackgroundLight: 'white',
      borderColor: '#E8EAEB',
      paginationBlue: baseColors.primary,
      bottomColor: '#E0E0E0',
    },
    primary: {
      main: baseColors.primary,
      contrastText: '#FFFFFF',
      light: '#F1F4F7',
      lightContrast: '#D9DCDE',
      dark: '#727272',
      hover: baseColors.primaryDark,
      focus: 'rgba(0,0,0,0.04)',
    },
    secondary: {
      main: baseColors.primary,
      contrastText: '#8F96A1',
      dark: '#333F52',
    },
    panel: {
      background: '#E9ECEF',
      footer: '#d7dbdf',
      outsidePanel: '#000000',
      outsidePanelOpacity: 0.4,
    },
    error: {
      main: baseColors.danger,
      contrastText: '#8F96A1',
      dark: baseColors.dangerDark,
    },
    terra: {
      green: baseColors.success,
      darkGreen: baseColors.successDark,
    },
  },
  shape: {
    borderRadius: 5,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: baseColors.successDark,
          boxShadow: 'none',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&$expanded': {
            margin: '0px',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
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
    },
    MuiTablePagination: {
      styleOverrides: {
        actions: {
          marginRight: '20px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: LINK,
          color: WHITE,
          '&:hover': {
            backgroundColor: LINK_HOVER,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& $notchedOutline': {
            borderColor: '#c0c0c0',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          '& $stickyHeader': {
            backgroundColor: '#fafafa',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: 160,
          '&.Mui-selected': {
            color: baseColors.dark,
          },
        },
      },
    },
  },
  mixins: {
    jadeLink: {
      color: LINK,
      '&:hover': {
        color: LINK_HOVER,
      },
    },
    containerWidth: {
      width: '100%',
    },
    pageRoot: {
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    pageTitle: {
      marginBottom: '1rem',
    },
  },
  constants: {
    navBarHeight: '64px',
  },
});

export default theme;
