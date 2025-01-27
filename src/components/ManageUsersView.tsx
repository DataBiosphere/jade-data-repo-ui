import React from 'react';
import { Box } from '@mui/material';
import Chip from '@mui/material/Chip';

interface ManageUsersProps {
  removeUser?: (removableEmail: string) => void;
  users: Array<string>;
}

function ManageUsersView({ removeUser, users }: ManageUsersProps) {
  const userChips =
    !!users &&
    users.map((user) => (
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

  return (
    <Box data-cy="chip-container">
      {users && users.length > 0 && (
        <Box
          sx={{
            margin: 0,
            width: '100%',
          }}
        >
          {userChips}
        </Box>
      )}
    </Box>
  );
}

export default ManageUsersView;
