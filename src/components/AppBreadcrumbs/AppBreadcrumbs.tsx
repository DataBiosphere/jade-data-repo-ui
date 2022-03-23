import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import { Breadcrumbs, Link, LinkProps } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { ClassNameMap } from '@material-ui/styles';

const styles = (theme: Theme) => ({
  terminalBreadcrumb: {
    color: theme.palette.primary.dark,
    cursor: 'default',
    '&:hover': {
      textDecoration: 'none',
    },
  },
});

type Context = { type: string; id: string; name: string };
type Breadcrumb = { text: string; to: string };

type AppBreadcrumbsProps = {
  childBreadcrumbs: Breadcrumb[];
  context: Context;
};

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

const AppBreadcrumbs = ({ context, childBreadcrumbs }: AppBreadcrumbsProps) => {
  const { id, name, type } = context;

  const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

  const breadcrumbs: Breadcrumb[] = [
    { text: 'Dashboard', to: '' },
    { text: `${capitalize(type)}s`, to: `${type}s` },
    { text: name, to: id },
    ...(childBreadcrumbs || []),
  ];

  const hierarchy: string[] = [];

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map((breadcrumb, i) => {
        const { text, to } = breadcrumb;
        const disabled = i === breadcrumbs.length - 1;
        hierarchy.push(to);
        const link = `${hierarchy.join('/')}`;
        return (
          <BreadcrumbLink key={text.toLowerCase()} to={link} disabled={disabled}>
            {text}
          </BreadcrumbLink>
        );
      })}
    </Breadcrumbs>
  );
};

export default AppBreadcrumbs;
