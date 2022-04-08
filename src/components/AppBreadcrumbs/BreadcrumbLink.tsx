import { CustomTheme } from '@mui/material/styles';
import { Link, LinkProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ClassNameMap, withStyles } from '@mui/styles';
import React from 'react';

const styles = (theme: CustomTheme) => ({
  terminalBreadcrumb: {
    color: theme.palette.primary.dark,
    cursor: 'default',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  jadeLink: {
    ...theme.mixins.jadeLink,
  },
});

const BreadcrumbLink = withStyles(styles)(
  (props: LinkProps<RouterLink, { classes: ClassNameMap; disabled: boolean }>) => {
    const { classes, children, ...other } = props;
    if (props.disabled) {
      return (
        <Link component={RouterLink} color="primary" onClick={(e) => e.preventDefault()} {...other}>
          <span className={classes.terminalBreadcrumb}>{children}</span>
        </Link>
      );
    }
    return (
      <Link component={RouterLink} color="primary" {...other}>
        <span className={classes.jadeLink}>{children}</span>
      </Link>
    );
  },
);

export default BreadcrumbLink;
