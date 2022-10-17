import React from 'react';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import { Accordion, AccordionDetails, AccordionSummary, CustomTheme } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import ManageUsersModal from './ManageUsersModal';

const styles = (theme: CustomTheme) =>
  createStyles({
    header: {
      fontSize: '14px',
      lineHeight: '22px',
      fontWeight: '600',
      color: theme.palette.primary.main,
    },
    expandIcon: {
      color: theme.palette.primary.main,
    },
    manageUsersHorizontalModal: {},
    values: {
      paddingBottom: theme.spacing(1),
    },
    root: {
      marginTop: theme.spacing(3),
    },
    noUsers: {
      fontStyle: 'italic',
      colorPrimary: theme.palette.error.contrastText,
      color: theme.palette.error.contrastText,
    },
  });

interface UserListProps extends WithStyles<typeof styles> {
  addUser: any;
  canManageUsers: boolean;
  defaultOpen?: boolean;
  horizontal?: boolean;
  isAddingOrRemovingUser: boolean;
  removeUser: any;
  typeOfUsers: string;
  users: Array<string>;
}

class UserList extends React.PureComponent<UserListProps> {
  render() {
    const {
      addUser,
      canManageUsers,
      classes,
      defaultOpen,
      horizontal,
      removeUser,
      typeOfUsers,
      users,
      isAddingOrRemovingUser,
    } = this.props;

    return (
      <Accordion defaultExpanded={defaultOpen}>
        <AccordionSummary
          expandIcon={<ExpandMore className={classes.expandIcon} />}
          className={classes.header}
        >
          {typeOfUsers}
        </AccordionSummary>
        <AccordionDetails data-cy="user-email">
          {canManageUsers && (
            <ManageUsersModal
              addUser={addUser}
              isLoading={isAddingOrRemovingUser}
              removeUser={removeUser}
              modalText={`Manage ${typeOfUsers}`}
              users={users}
              horizontal={horizontal}
            />
          )}
          {users.length === 0 && <Typography className={classes.noUsers}>(None)</Typography>}
          {users.map((user) => (
            <Typography noWrap key={user}>
              {user}
            </Typography>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default withStyles(styles)(UserList);
