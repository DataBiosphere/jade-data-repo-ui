import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  styled,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import ManageUsersView from './ManageUsersView';

interface UserListProps {
  canManageUsers: boolean;
  defaultOpen?: boolean;
  removeUser?: (removableEmail: string) => void;
  typeOfUsers: string;
  users: Array<string>;
}

const UserTypeAccordionHeader = styled(AccordionSummary)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '22px',
  fontWeight: '600',
  color: theme.palette.primary.main,
}));

const NoUsersLabel = styled(Typography)(({ theme }) => ({
  fontStyle: 'italic',
  color: theme.palette.error.contrastText,
  paddingBottom: '8px',
}));

function UserList({ canManageUsers, defaultOpen, removeUser, typeOfUsers, users }: UserListProps) {
  return (
    <Accordion defaultExpanded={defaultOpen}>
      <UserTypeAccordionHeader
        expandIcon={<ExpandMore sx={{ color: 'primary.main' }} />}
        data-cy={`user-list-${typeOfUsers}`}
      >
        {typeOfUsers}
      </UserTypeAccordionHeader>
      <AccordionDetails
        data-cy="user-email"
        sx={{
          paddingTop: canManageUsers ? '0px' : undefined,
        }}
      >
        <ManageUsersView removeUser={canManageUsers ? removeUser : undefined} users={users} />
        {users.length === 0 && <NoUsersLabel>(None)</NoUsersLabel>}
      </AccordionDetails>
    </Accordion>
  );
}

export default UserList;
