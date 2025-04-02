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
  const createUserChip = (
    user: string,
    options: {
      color: 'primary' | 'secondary';
      onDelete?: () => void;
      title?: string;
    },
  ) => (
    <Box data-cy="chip-item" key={user}>
      <Chip
        sx={(theme) => ({
          marginBottom: theme.spacing(1),
        })}
        color={options.color}
        label={user}
        key={user}
        onDelete={options.onDelete}
        title={options.title}
        variant="outlined"
        data-cy={`chip-${user}`}
      />
    </Box>
  );

  const userChips = users.map((user) =>
    createUserChip(user, {
      color: 'primary',
      onDelete: removeUser ? () => removeUser(user) : undefined,
    }),
  );

  const readOnlyUserChips =
    readOnlyUsers?.map((user) =>
      createUserChip(user, {
        color: 'secondary',
        title: readOnlyUserTooltip,
      }),
    ) || [];
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
