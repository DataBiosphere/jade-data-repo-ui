import React from 'react';
import clsx from 'clsx';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import { Accordion, AccordionDetails, AccordionSummary, CustomTheme } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import ManageUsersView from './ManageUsersView';

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
    canManageUsers: {
      paddingTop: 0,
    },
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
      paddingBottom: theme.spacing(1),
    },
  });

interface UserListProps extends WithStyles<typeof styles> {
  canManageUsers: boolean;
  defaultOpen?: boolean;
  removeUser?: any;
  typeOfUsers: string;
  users: Array<string>;
}

function UserList({
  classes,
  canManageUsers,
  defaultOpen,
  removeUser,
  typeOfUsers,
  users,
}: UserListProps) {
  return (
    <Accordion defaultExpanded={defaultOpen}>
      <AccordionSummary
        expandIcon={<ExpandMore className={classes.expandIcon} />}
        className={classes.header}
      >
        {typeOfUsers}
      </AccordionSummary>
      <AccordionDetails
        data-cy="user-email"
        className={clsx({
          [classes.canManageUsers]: canManageUsers,
        })}
      >
        <ManageUsersView removeUser={canManageUsers ? removeUser : undefined} users={users} />
        {users.length === 0 && <Typography className={classes.noUsers}>(None)</Typography>}
      </AccordionDetails>
    </Accordion>
  );
}

export default withStyles(styles)(UserList);
