import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Select,
  TextField,
  Menu,
  MenuItem,
  Button,
  Divider,
  IconButton,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { actions } from 'react-redux-form';
import { isEmail } from 'validator';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  section: {
    margin: `${theme.spacing(1)}px 0px`,
  },
  input: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.spacing(0.5),
  },
  inviteButton: {
    backgroundColor: theme.palette.common.link,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.link,
    },
  },
  listItem: {
    justifyContent: 'space-between',
    fontWeight: 500,
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.primary.focus,
    },
    borderRadius: theme.spacing(0.5),
  },
  withIcon: {
    display: 'flex',
    alignItems: 'center',
  },
});

export class ShareSnapshot extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      usersToAdd: [],
      policyName: 'reader',
      currentInput: '',
      anchor: null,
      hasError: false,
      errorMsg: '',
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    policies: PropTypes.arrayOf(PropTypes.object),
    readers: PropTypes.arrayOf(PropTypes.string),
    snapshot: PropTypes.object,
  };

  /**
   * handles dropdown selection
   */
  setPermission = (event) => {
    this.setState({ policyName: event.target.value });
  };

  /**
   * handles plain text input
   */
  parseEmail = (event) => {
    const currentInput = event.target.value;
    this.setState({ currentInput });

    const { usersToAdd } = this.state;

    // emails may be added with the press of the comma key in addition to enter key
    if (currentInput.includes(',')) {
      const emails = currentInput.split(',');
      emails.forEach(email => {
        const trimmed = email.trim();
        if (trimmed !== '') {
          usersToAdd.push(trimmed);
        }
      });
      this.setState({ usersToAdd, currentInput: '' });
    }
  };

  /**
   * adds the email as a tag to the text box
   */
  inputEmail = (event, value) => {
    const nonEmptyStrings = value.map(string => string.trim()).filter(string => string !== '');
    this.setState({ usersToAdd: nonEmptyStrings, currentInput: '' });
  };

  /**
   * updates the snapshot readers to include users that have been entered
   */
  invite = () => {
    this.setState({ hasError: false, errorMsg: '' });

    const { usersToAdd, currentInput } = this.state;
    const trimmed = currentInput.trim();
    if (trimmed !== '' && !usersToAdd.includes(trimmed)) {
      usersToAdd.push(trimmed);
    }

    let hasError = false;
    let errorMsg = '';
    let validUsrs = [];
    let invalidUsrs = [];
    _.forEach(usersToAdd, (user) => {
      console.log(user);
      if (!isEmail(user)) {
        console.log('bad input');
        hasError = true;
        invalidUsrs.push(user);
      } else {
        validUsrs.push(user);
      }
    });
    errorMsg = `Make sure all emails entered are valid. Invalid email(s) entered: ${invalidUsrs}`;
    !_.isEmpty(validUsrs) && this.addReaders(validUsrs);
    this.setState({ usersToAdd: [], currentInput: '', hasError, errorMsg });
  };

  /**
   * TODO: once discoverers can be added, change this to take in the policy as a parameter
   */
  addReaders(users) {
    const { dispatch, readers } = this.props;
    if (!readers) {
      dispatch(actions.change('snapshot.readers', users));
    } else {
      const newUsers = _.difference(users, readers);
      dispatch(actions.change('snapshot.readers', _.concat(readers, newUsers)));
    }
  }

  /**
   * TODO: once discoverers can be added, change this to take in the policy as a parameter
   */
  removeReader(removeableEmail) {
    this.closeUserMenu();
    const { dispatch, readers } = this.props;
    const newUsers = _.without(readers, removeableEmail);
    dispatch(actions.change('snapshot.readers', newUsers));
  }

  openUserMenu = (event) => {
    this.setState({ anchor: event.currentTarget });
  };

  closeUserMenu = () => {
    this.setState({ anchor: null });
  };

  render() {
    const { classes, readers } = this.props;
    const { policyName, currentInput, usersToAdd, anchor, hasError, errorMsg } = this.state;

    const permissions = ['can read', 'can discover'];
    const policyNames = ['reader', 'discoverer'];

    return (
      <div className={classes.root}>
        <Typography variant="h6" className={classes.section}>
          Share Snapshot
        </Typography>
        <Grid container spacing={2} className={classes.section}>
          <Grid container spacing={2}>
            <Grid item xs={7}>
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
                    onChange={this.parseEmail}
                    data-cy="enterEmailBox"
                  />
                )}
                onChange={this.inputEmail}
                value={usersToAdd}
                inputValue={currentInput}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2">Permissions</Typography>
              <Select
                value={policyName}
                variant="outlined"
                className={classes.input}
                fullWidth
                onChange={this.setPermission}
              >
                {permissions.map((permission, i) => (
                  <MenuItem key={i} value={policyNames[i]} disabled={permission === 'can discover'}>
                    {permission}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {hasError && (
                <Typography variant="subtitle2" color="error" data-cy="invalidEmailError">
                  {errorMsg}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid item xs>
            <Button
              variant="contained"
              disableElevation={true}
              className={classes.inviteButton}
              onClick={this.invite}
              data-cy="inviteButton"
            >
              Invite
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <div className={classes.section} data-cy="readers">
          {readers.map((reader) => (
            <div
              key={reader}
              className={clsx(classes.listItem, classes.withIcon)}
              data-cy="specificReader"
            >
              <div>{reader}</div>
              <div className={classes.withIcon} id={reader} onClick={this.openUserMenu}>
                can read
                <IconButton size="small" data-cy="moreButton">
                  <MoreVert />
                </IconButton>
              </div>
            </div>
          ))}
          <Menu anchorEl={anchor} onClose={this.closeUserMenu} open={anchor !== null}>
            {permissions.map((permission) => (
              <MenuItem onClick={this.closeUserMenu} disabled={permission === 'can discover'} dense>
                {permission}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={() => this.removeReader(anchor.id)} dense data-cy="removeItem">
              remove
            </MenuItem>
          </Menu>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    readers: state.snapshot.readers,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(ShareSnapshot));
