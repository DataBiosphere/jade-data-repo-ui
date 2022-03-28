import { Theme, withStyles } from '@material-ui/core/styles';
import { Link, LinkProps } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { ClassNameMap } from '@material-ui/styles';
import React from 'react';

const styles = (theme: Theme) => ({
  terminalBreadcrumb: {
    color: theme.palette.primary.dark,
    cursor: 'default',
    '&:hover': {
      textDecoration: 'none',
    },
  },
});

const BreadcrumbLink = withStyles(styles)(
  (props: LinkProps<RouterLink, { classes: ClassNameMap; disabled: boolean }>) => {
    const { classes, ...other } = props;
    if (props.disabled) {
      return (
        <Link
          component={RouterLink}
          color="primary"
          className={classes.terminalBreadcrumb}
          onClick={(e) => e.preventDefault()}
          {...other}
        />
      );
    }
    return <Link component={RouterLink} color="primary" {...other} />;
  },
);

export default BreadcrumbLink;
