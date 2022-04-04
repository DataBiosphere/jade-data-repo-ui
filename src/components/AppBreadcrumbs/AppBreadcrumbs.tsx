import React from 'react';
import { Breadcrumbs } from '@material-ui/core';
import BreadcrumbLink from './BreadcrumbLink';

type Context = { type: string; id: string; name: string };
type Breadcrumb = { text: string; to: string };

type AppBreadcrumbsProps = {
  childBreadcrumbs: Breadcrumb[];
  context: Context;
};

function AppBreadcrumbs({ context, childBreadcrumbs }: AppBreadcrumbsProps) {
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
}

export default AppBreadcrumbs;
