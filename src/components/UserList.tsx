import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import ManageUsersView from './ManageUsersView';

interface UserListProps {
  canManageUsers: boolean;
  defaultOpen?: boolean;
  removeUser?: (removableEmail: string) => void;
  typeOfUsers: string;
  users: Array<string>;
}

function UserList({ canManageUsers, defaultOpen, removeUser, typeOfUsers, users }: UserListProps) {
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
      <AccordionDetails data-cy="user-email" sx={canManageUsers ? { pt: 0 } : undefined}>
        <ManageUsersView removeUser={canManageUsers ? removeUser : undefined} users={users} />
        {users.length === 0 && (
          <Typography
            sx={{
              fontStyle: 'italic',
              color: 'error.contrastText',
              pb: '8px',
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
