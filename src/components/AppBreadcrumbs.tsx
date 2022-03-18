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

type Context = { type: string; id: string; name: string };

type AppBreadcrumbsProps = {
  links: Array<Function>;
  context: Context;
};

const BreadcrumbsLink = withStyles(styles)((props: any) => {
  const { classes, ...other } = props;
  return <Link component={RouterLink} color="primary" className={classes.breadcrumb} {...other} />;
});

const TerminalBreadcrumb = withStyles(styles)((props: any) => {
  const { classes, ...other } = props;
  return <Link color="primary" className={classes.terminalBreadcrumb} {...other} />;
});

const Breadcrumb = withStyles(styles)((props: any) => {
  if (props.disabled) {
    return <TerminalBreadcrumb {...props} />;
  }
  return <BreadcrumbsLink {...props} />;
});

function dashboardLink(key: string, disabled: boolean) {
  return (
    <Breadcrumb key={key} to="/" disabled={disabled}>
      Dashboard
    </Breadcrumb>
  );
}

function contextLink(context: Context) {
  return (key: string, disabled: boolean) => (
    <Breadcrumb key={key} to={`/${context.type}`} disabled={disabled}>
      {capitalize(context.type)}
    </Breadcrumb>
  );
}

function collectionLink(context: Context) {
  return (key: string, disabled: boolean) => (
    <Breadcrumb key={key} to={`/${context.type}/${context.id}`} disabled={disabled}>
      {context.name}
    </Breadcrumb>
  );
}

export function contextChildLink(child: string, text: string) {
  return (key: string, disabled: boolean) => (
    <Breadcrumb key={key} to={child} disabled={disabled}>
      {text}
    </Breadcrumb>
  );
}

const AppBreadcrumbs: React.FC<AppBreadcrumbsProps> = (props) => {
  const { context, links } = props;

  const contextLinks: Array<Function> = [
    dashboardLink,
    contextLink(context),
    collectionLink(context),
  ];
  const toRender: Array<Function> = [...contextLinks, ...(links || [])];

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {toRender.map((linkFunc, i) => linkFunc(i, i === toRender.length - 1))}
    </Breadcrumbs>
  );
};

export default withStyles(styles)(AppBreadcrumbs);
