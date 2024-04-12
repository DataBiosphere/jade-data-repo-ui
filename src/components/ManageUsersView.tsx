import React from 'react';
import { WithStyles, withStyles } from '@mui/styles';
import { CustomTheme } from '@mui/material';
import Chip from '@mui/material/Chip';

const styles = (theme: CustomTheme) => ({
  chip: {
    marginBottom: theme.spacing(1),
  },
  chipContainer: {
    margin: 0,
    width: '100%',
  },
});

interface ManageUsersProps extends WithStyles<typeof styles> {
  removeUser?: (removableEmail: string) => void;
  users: Array<string>;
}

function ManageUsersView({ classes, removeUser, users }: ManageUsersProps) {
  const userChips =
    !!users &&
    users.map((user) => (
      <div data-cy="chip-item" key={user}>
        <Chip
          className={classes.chip}
          color="primary"
          label={user}
          key={user}
          onDelete={() => removeUser?.(user)}
          variant="outlined"
          data-cy={`chip-${user}`}
        />
      </div>
    ));

  return (
    <div data-cy="chip-container">
      {users && users.length > 0 && <div className={classes.chipContainer}>{userChips}</div>}
    </div>
  );
}

export default withStyles(styles)(ManageUsersView);
