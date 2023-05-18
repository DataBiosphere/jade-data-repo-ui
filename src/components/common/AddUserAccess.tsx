import React, { useState } from 'react';
import _ from 'lodash';
import { CustomTheme } from '@mui/material/styles';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import {
  Typography,
  Autocomplete,
  TextField,
  Select,
  SelectChangeEvent,
  MenuItem,
  Button,
} from '@mui/material';
import clsx from 'clsx';
import isEmail from 'validator/lib/isEmail';

const styles = (theme: CustomTheme) =>
  createStyles({
    sharingArea: {
      display: 'flex',
      'flex-direction': 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    emailEntryArea: {
      display: 'flex',
    },
    sharingCol: {
      flexGrow: 1,
      marginRight: '1rem',
    },
    permissionsCol: {
      flexGrow: 'unset',
      width: 150,
    },
    input: {
      backgroundColor: theme.palette.common.white,
      borderRadius: theme.spacing(0.5),
    },
    sharingButtonContainer: {
      paddingTop: 22,
    },
    button: {
      backgroundColor: theme.palette.common.link,
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.common.link,
      },
    },
    section: {
      margin: `${theme.spacing(1)} 0px`,
      overflowX: 'hidden',
    },
    errMessage: {
      color: theme.palette.error.main,
    },
  });

export interface AccessPermission {
  policy: string;
  disabled: boolean;
}

interface AddUserAccessProps extends WithStyles<typeof styles> {
  permissions: AccessPermission[];
  onAdd: (policyName: string, usersToAdd: string[]) => void;
}

function AddUserAccess({ classes, permissions, onAdd }: AddUserAccessProps) {
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
      <div className={classes.sharingArea} data-cy="manageAccessContainer">
        <div className={classes.sharingCol}>
          <Typography variant="subtitle2">People</Typography>
          <Autocomplete
            multiple
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                className={classes.input}
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
        </div>
        <div className={clsx(classes.sharingCol, classes.permissionsCol)}>
          <Typography variant="subtitle2">Permissions</Typography>
          <Select
            value={policyName}
            variant="outlined"
            className={classes.input}
            fullWidth
            onChange={(event: SelectChangeEvent) => setPolicyName(event.target.value)}
          >
            {permissions.map((permission: any, i: number) => (
              <MenuItem
                key={`${i}-${permission.policy}`}
                value={permission.policy}
                disabled={permission.disabled}
              >
                {permissionDisplays[i]}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={classes.sharingButtonContainer}>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            disabled={!isEmail(addEmailInput) && !_.some(usersToAdd, (user) => isEmail(user))}
            className={clsx(classes.button, classes.section)}
            onClick={invite}
            data-cy="inviteButton"
          >
            Add
          </Button>
        </div>
      </div>
      {err && <div className={classes.errMessage}>{err}</div>}
    </>
  );
}

export default withStyles(styles)(AddUserAccess);
