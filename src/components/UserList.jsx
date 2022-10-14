import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import ManageUsersModal from './ManageUsersModal';

const styles = (theme) => ({
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

class UserList extends React.PureComponent {
  static propTypes = {
    addUser: PropTypes.func,
    canManageUsers: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    defaultOpen: PropTypes.bool,
    horizontal: PropTypes.bool,
    isAddingOrRemovingUser: PropTypes.bool,
    removeUser: PropTypes.func,
    typeOfUsers: PropTypes.string,
    users: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

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
