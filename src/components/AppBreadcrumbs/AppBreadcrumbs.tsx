import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Breadcrumbs, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles = (theme: any) => ({
  terminalBreadcrumb: {
    color: theme.palette.primary.dark,
    cursor: 'default',
    '&:hover': {
      textDecoration: 'none',
    },
  },
});

export type Context = { type: string; id: string; name: string };
export type BreadcrumbElement = { text: string; to: string };

type AppBreadcrumbsProps = {
  childBreadcrumbs: Array<BreadcrumbElement>;
  context: Context;
};

const Breadcrumb = withStyles(styles)((props: any) => {
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
});

const AppBreadcrumbs: React.FC<AppBreadcrumbsProps> = (props) => {
  const { context, childBreadcrumbs } = props;

  const breadcrumbs: Array<BreadcrumbElement> = [
    { text: 'Dashboard', to: '' },
    { text: `${capitalize(context.type)}s`, to: `${context.type}s` },
    { text: context.name, to: context.id },
    ...(childBreadcrumbs || []),
  ];

  const hierarchy: Array<string> = [];

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map((breadcrumb, i) => {
        const { text, to } = breadcrumb;
        const disabled = i === breadcrumbs.length - 1;
        hierarchy.push(to);
        const link = `${hierarchy.join('/')}`;
        return (
          <Breadcrumb key={text.toLowerCase()} to={link} disabled={disabled}>
            {text}
          </Breadcrumb>
        );
      })}
    </Breadcrumbs>
  );
};

export default withStyles(styles)(AppBreadcrumbs);
