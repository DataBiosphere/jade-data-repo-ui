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
  removeUser?: () => void;
  users: Array<string>;
}

function ManageUsersView({ classes, removeUser, users }: ManageUsersProps) {
  const userChips =
    !!users &&
    users.map((user) => (
      <div key={user}>
        <Chip
          className={classes.chip}
          color="primary"
          label={user}
          key={user}
          onDelete={removeUser}
          variant="outlined"
        />
      </div>
    ));

  return (
    <div>
      {users && users.length > 0 && <div className={classes.chipContainer}>{userChips}</div>}
    </div>
  );
}

export default withStyles(styles)(ManageUsersView);
