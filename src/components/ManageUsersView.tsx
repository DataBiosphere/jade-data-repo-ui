import React from 'react';
import { Box } from '@mui/material';
import Chip from '@mui/material/Chip';

interface ManageUsersProps {
  readonly removeUser?: (removableEmail: string) => void;
  readonly users: Array<string>;
  readonly readOnlyUsers?: Array<string>;
  readonly readOnlyUserTooltip?: string;
}

function ManageUsersView({
  removeUser,
  users,
  readOnlyUsers,
  readOnlyUserTooltip,
}: ManageUsersProps) {
  const userChips = users.map((user) => (
    <Box data-cy="chip-item" key={user}>
      <Chip
        sx={(theme) => ({
          marginBottom: theme.spacing(1),
        })}
        color="primary"
        label={user}
        key={user}
        onDelete={removeUser ? () => removeUser?.(user) : undefined}
        variant="outlined"
        data-cy={`chip-${user}`}
      />
    </Box>
  ));
  const readOnlyUserChips =
    readOnlyUsers?.map((user) => (
      <Box data-cy="chip-item" key={user}>
        <Chip
          title={readOnlyUserTooltip}
          sx={(theme) => ({
            marginBottom: theme.spacing(1),
          })}
          color="secondary"
          label={user}
          key={user}
          variant="outlined"
          data-cy={`chip-${user}`}
        />
      </Box>
    )) || [];

  return (
    <Box data-cy="chip-container">
      {(userChips.length > 0 || readOnlyUserChips.length > 0) && (
        <Box
          sx={{
            margin: 0,
            width: '100%',
          }}
        >
          {userChips}
          {readOnlyUserChips}
        </Box>
      )}
    </Box>
  );
}

export default ManageUsersView;
