import React, { useState } from 'react';
import _ from 'lodash';
import { styled } from '@mui/system';
import {
  Typography,
  Autocomplete,
  TextField,
  Select,
  SelectChangeEvent,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import clsx from 'clsx';
import isEmail from 'validator/lib/isEmail';

// Styled components (>3 styles)
const SharingArea = styled(Box)(({ theme }: { theme: CustomTheme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

// The rest can use sx prop as they have ≤3 styles
function AddUserAccess({ permissions, onAdd }: Omit<AddUserAccessProps, 'classes'>) {
  const [policyName, setPolicyName] = useState(permissions[0].policy);
  const permissionDisplays = permissions.map((perm) =>
    perm.policy
      // insert space before all caps
      .replace(/([A-Z])/g, ' $1')
      // replace _ with space
      .replace(/([_])/g, ' ')
      // uppercase the first character
      .replace(/^./, (str) => str.toUpperCase()),
  );
  const [addEmailInput, setAddEmailInput] = useState('');
  const [usersToAdd, setUsersToAdd] = useState([] as string[]);
  const [err, setErr] = useState('');

  const inputEmail = (_event: any, value: any) => {
    const nonEmptyStrings = value.map((s: string) => s.trim()).filter((s: string) => s !== '');
    setUsersToAdd(nonEmptyStrings);
    setAddEmailInput('');
  };

  // Split out emails by commas
  const parseEmail = (event: any) => {
    const currentInput = event.target.value;
    setAddEmailInput(currentInput);

    if (currentInput.includes(',')) {
      const emails = currentInput
        .split(',')
        .map((email: string) => email.trim())
        .filter((x: string) => x);
      setUsersToAdd([...usersToAdd, ...emails]);
      setAddEmailInput('');
    }
  };

  const invite = () => {
    setErr('');
    const trimmed = addEmailInput.trim();
    if (trimmed && !usersToAdd.includes(trimmed)) {
      usersToAdd.push(trimmed);
    }

    const validatedUsers = _.partition(usersToAdd, (user: string) => isEmail(user));
    if (validatedUsers[1].length > 0) {
      setErr(
        `Invalid emails found, please remove them to continue: ${validatedUsers[1].join(', ')}`,
      );
    } else if (validatedUsers[0].length > 0) {
      onAdd(policyName, usersToAdd);
      setUsersToAdd([]);
      setAddEmailInput('');
    }
  };

  return (
    <>
      <SharingArea data-cy="manageAccessContainer">
        <Box sx={{ flexGrow: 1, marginRight: '1rem' }}>
          <Typography variant="subtitle2">People</Typography>
          <Autocomplete
            multiple
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                sx={{
                  backgroundColor: 'common.white',
                  borderRadius: 0.5,
                }}
                placeholder="enter email addresses"
                onChange={parseEmail}
                data-cy="enterEmailBox"
              />
            )}
            onChange={inputEmail}
            value={usersToAdd}
            inputValue={addEmailInput}
            options={[]}
          />
        </Box>
        <Box
          sx={{
            flexGrow: 'unset',
            width: '150px',
            marginRight: '1rem',
          }}
        >
          <Typography variant="subtitle2">Permissions</Typography>
          <Select
            value={policyName}
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: 'common.white',
              borderRadius: 0.5,
            }}
            onChange={(event: SelectChangeEvent) => setPolicyName(event.target.value)}
            data-cy="roleSelect"
          >
            {permissions.map((permission: any, i: number) => (
              <MenuItem
                key={`${i}-${permission.policy}`}
                value={permission.policy}
                disabled={permission.disabled}
                data-cy={`roleOption-${permission.policy}`}
              >
                {permissionDisplays[i]}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ paddingTop: '22px' }}>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            disabled={!isEmail(addEmailInput) && !_.some(usersToAdd, (user) => isEmail(user))}
            sx={{
              backgroundColor: 'common.link',
              color: 'common.white',
              margin: '8px 0px',
              '&:hover': {
                backgroundColor: 'common.link',
              },
            }}
            onClick={invite}
            data-cy="inviteButton"
          >
            Add
          </Button>
        </Box>
      </SharingArea>
      {err && <Box sx={{ color: 'error.main' }}>{err}</Box>}
    </>
  );
}

export default AddUserAccess;
