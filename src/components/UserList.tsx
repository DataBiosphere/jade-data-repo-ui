import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import ManageUsersView from './ManageUsersView';

interface UserListProps {
  message?: string;
  canManageUsers: boolean;
  defaultOpen?: boolean;
  removeUser?: (removableEmail: string) => void;
  typeOfUsers: string;
  users: Array<string>;
}

function UserList({
  message,
  canManageUsers,
  defaultOpen,
  removeUser,
  typeOfUsers,
  users,
}: UserListProps) {
  return (
    <Accordion defaultExpanded={defaultOpen}>
      <AccordionSummary
        expandIcon={<ExpandMore sx={{ color: 'primary.main' }} />}
        sx={{
          fontSize: '14px',
          lineHeight: '22px',
          fontWeight: '600',
          color: 'primary.main',
        }}
        data-cy={`user-list-${typeOfUsers}`}
      >
        {typeOfUsers}
      </AccordionSummary>
      <AccordionDetails data-cy="user-email" sx={canManageUsers ? { paddingTop: 0 } : undefined}>
        {message && (
          <Typography sx={{ marginTop: '-16px', paddingBottom: '12px' }}>{message}</Typography>
        )}
        <ManageUsersView removeUser={canManageUsers ? removeUser : undefined} users={users} />
        {users.length === 0 && (
          <Typography
            sx={{
              fontStyle: 'italic',
              color: 'error.contrastText',
              paddingBottom: '8px',
            }}
          >
            (None)
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default UserList;
