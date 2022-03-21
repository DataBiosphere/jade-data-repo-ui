import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Breadcrumbs, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles = (theme: any) => ({
  breadcrumb: {
    fontStyle: 'italic',
  },
  terminalBreadcrumb: {
    fontStyle: 'italic',
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
  links: Array<BreadcrumbElement>;
  context: Context;
};

const BreadcrumbsLink = withStyles(styles)((props: any) => {
  const { classes, ...other } = props;
  return <Link component={RouterLink} color="primary" className={classes.breadcrumb} {...other} />;
});

const TerminalBreadcrumb = withStyles(styles)((props: any) => {
  const { classes, ...other } = props;
  return (
    <Link
      component={RouterLink}
      color="primary"
      className={classes.terminalBreadcrumb}
      {...other}
      onClick={(e) => e.preventDefault()}
    />
  );
});

const Breadcrumb = withStyles(styles)((props: any) => {
  if (props.disabled) {
    return <TerminalBreadcrumb {...props} />;
  }
  return <BreadcrumbsLink {...props} />;
});

function breadcrumbLink(text: string, to: string, disabled: boolean) {
  return (
    <Breadcrumb key={text.toLowerCase()} to={to} disabled={disabled}>
      {text}
    </Breadcrumb>
  );
}

const AppBreadcrumbs: React.FC<AppBreadcrumbsProps> = (props) => {
  const { context, links } = props;

  const breadcrumbs: Array<BreadcrumbElement> = [
    { text: 'Dashboard', to: '' },
    { text: `${capitalize(context.type)}s`, to: `${context.type}s` },
    { text: context.name, to: context.id },
    ...(links || []),
  ];

  const hierarchy: Array<string> = [];

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map((obj, i) => {
        hierarchy.push(obj.to);
        const link = `${hierarchy.join('/')}`;
        return breadcrumbLink(obj.text, link, i === breadcrumbs.length - 1);
      })}
    </Breadcrumbs>
  );
};

export default withStyles(styles)(AppBreadcrumbs);
