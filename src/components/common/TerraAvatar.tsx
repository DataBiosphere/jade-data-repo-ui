import React from 'react';

import { connect } from 'react-redux';
import { UserState } from 'reducers/user';
import { Avatar } from '@mui/material';

interface IProps {
  user: UserState;
}

// Example from MUI
function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  const names = name.toUpperCase().split(' ');
  const children = names.length === 1 ? `${names[0]}` : `${names[0][0]}${names[1][0]}`;
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children,
  };
}

function TerraAvatar({ user }: IProps) {
  if (user.image) {
    return (
      <Avatar
        src={user.image}
        alt={user.name}
        imgProps={{ referrerPolicy: 'no-referrer' }}
        data-cy="avatar"
      />
    );
  }
  return <Avatar {...stringAvatar(user.name || '')} alt={user.name} data-cy="avatar" />;
}

export default connect((state: any) => ({ user: state.user }))(TerraAvatar);
