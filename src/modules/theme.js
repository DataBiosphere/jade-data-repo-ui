import { createMuiTheme } from '@material-ui/core/styles';

export const headerHeight = 70;
export const appColor = '#7ebb7d';
export const easing = 'cubic-bezier(0.35, 0.01, 0.77, 0.34);';

export default createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});
