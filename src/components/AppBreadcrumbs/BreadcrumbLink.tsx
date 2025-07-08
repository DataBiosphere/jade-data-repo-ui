import { Link, LinkProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import { JadeLinkInline } from 'components/common/JadeLink';

function BreadcrumbLink(props: LinkProps<RouterLink, { disabled: boolean }>) {
  const { disabled, children, ...other } = props;

  if (disabled) {
    return (
      <Link
        component={RouterLink}
        color="primary"
        sx={{
          color: (theme) => theme.palette.primary.dark,
          cursor: 'default',
          '&:hover': {
            textDecoration: 'none',
          },
        }}
        onClick={(e) => e.preventDefault()}
        {...other}
      >
        <span>{children}</span>
      </Link>
    );
  }
  return (
    <Link component={RouterLink} color="primary" {...other}>
      <JadeLinkInline>{children}</JadeLinkInline>
    </Link>
  );
}

export default BreadcrumbLink;
