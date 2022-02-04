import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { isEmail } from 'validator';
import { addReadersToSnapshot, createSnapshot } from 'actions/index';

const drawerWidth = 600;
const sidebarWidth = 56;

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  section: {
    margin: `${theme.spacing(1)}px 0px`,
    overflowX: 'hidden',
  },
  sharingArea: {
    display: 'flex',
    flexDirection: 'column',
  },
  emailEntryArea: {
    display: 'flex',
  },
  emailEntry: {
    flexGrow: 1,
    marginRight: '1rem',
  },
  input: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.spacing(0.5),
  },
  button: {
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
  bottom: {
    position: 'fixed',
    bottom: '0',
    right: `${sidebarWidth + theme.spacing(1)}px`,
    width: `${drawerWidth - theme.spacing(4)}px`,
    textAlign: 'end',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: 'inherit',
  },
  modalBottom: {
    display: 'flex',
  },
  prevButton: {
    color: theme.palette.common.link,
    border: `1px solid ${theme.palette.common.link}`,
    marginRight: '0.5rem',
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
    dispatch: PropTypes.func,
    isModal: PropTypes.bool,
    onDismiss: PropTypes.func,
    policies: PropTypes.arrayOf(PropTypes.object),
    readers: PropTypes.arrayOf(PropTypes.string),
    setIsSharing: PropTypes.func,
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
      const email = _.trim(currentInput, ', ');
      if (email) {
        usersToAdd.push(email);
      }
      this.setState({ usersToAdd, currentInput: '' });
    }
  };

  /**
   * adds the email as a tag to the text box
   */
  inputEmail = (event, value) => {
    const nonEmptyStrings = value.map((string) => string.trim()).filter((string) => string !== '');
    this.setState({ usersToAdd: nonEmptyStrings, currentInput: '' });
  };

  /**
   * allows users to paste a list of emails
   */
  onPaste = (event) => {
    const { usersToAdd } = this.state;
    event.preventDefault();
    const text = event.clipboardData.getData('text');
    const emails = text.split(/[,\s]+/);
    const nonEmpty = emails.filter((s) => s !== '');
    this.setState({ usersToAdd: _.concat(usersToAdd, nonEmpty), currentInput: '' });
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
    const validUsrs = [];
    const invalidUsrs = [];
    _.forEach(usersToAdd, (user) => {
      if (!isEmail(user)) {
        hasError = true;
        invalidUsrs.push(user);
      } else {
        validUsrs.push(user);
      }
    });
    errorMsg = `Invalid email(s): ${invalidUsrs.join(', ')}`;
    // eslint-disable-next-line no-unused-expressions
    !_.isEmpty(validUsrs) && this.addReaders(validUsrs);
    this.setState({ usersToAdd: [], currentInput: '', hasError, errorMsg });
  };

  /**
   * TODO: once discoverers can be added, change this to take in the policy as a parameter
   */
  addReaders(users) {
    const { dispatch, readers } = this.props;
    if (!readers) {
      dispatch(addReadersToSnapshot(users));
    } else {
      const newUsers = _.difference(users, readers);
      dispatch(addReadersToSnapshot(_.concat(readers, newUsers)));
    }
  }

  /**
   * TODO: once discoverers can be added, change this to take in the policy as a parameter
   */
  removeReader(removeableEmail) {
    this.closeUserMenu();
    const { dispatch, readers } = this.props;
    const newUsers = _.without(readers, removeableEmail);
    dispatch(addReadersToSnapshot(newUsers));
  }

  openUserMenu = (event) => {
    this.setState({ anchor: event.currentTarget });
  };

  closeUserMenu = () => {
    this.setState({ anchor: null });
  };

  saveSnapshot = () => {
    const { dispatch } = this.props;
    dispatch(createSnapshot());
  };

  render() {
    const { classes, isModal, readers, setIsSharing, onDismiss } = this.props;
    const { policyName, currentInput, usersToAdd, anchor, hasError, errorMsg } = this.state;

    const permissions = ['can read', 'can discover'];
    const policyNames = ['reader', 'discoverer'];

    return (
      <div className={classes.root}>
        <Typography variant="h6" className={classes.section}>
          Share Snapshot
        </Typography>
        <div className={classes.sharingArea}>
          <div className={classes.emailEntryArea}>
            <div className={classes.emailEntry}>
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
                    onPaste={this.onPaste}
                    data-cy="enterEmailBox"
                  />
                )}
                onChange={this.inputEmail}
                value={usersToAdd}
                inputValue={currentInput}
                options={[]}
              />
            </div>
            <div>
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
            </div>
          </div>
          <div>
            {hasError && (
              <Typography variant="subtitle2" color="error" data-cy="invalidEmailError">
                {errorMsg}
              </Typography>
            )}
          </div>
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              disabled={!isEmail(currentInput) && !_.some(usersToAdd, (user) => isEmail(user))}
              className={clsx(classes.button, classes.section, classes.inviteButton)}
              onClick={this.invite}
              data-cy="inviteButton"
            >
              Invite
            </Button>
          </div>
        </div>
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
              <MenuItem
                onClick={this.closeUserMenu}
                disabled={permission === 'can discover'}
                key={permission}
                dense
              >
                {permission}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={() => this.removeReader(anchor.id)} dense data-cy="removeItem">
              remove
            </MenuItem>
          </Menu>
        </div>
        {!isModal && (
          <div className={classes.bottom}>
            <Divider />
            <Button
              variant="contained"
              color="primary"
              disableElevation
              className={clsx(classes.button, classes.section)}
              onClick={this.saveSnapshot}
              data-cy="releaseDataset"
            >
              Create Snapshot
            </Button>
          </div>
        )}
        {isModal && (
          <div className={classes.modalBottom}>
            <Button onClick={onDismiss}>Cancel</Button>
            <div style={{ flexGrow: 1 }} />
            <Button className={classes.prevButton} variant="outlined" onClick={setIsSharing}>
              Previous
            </Button>
            <Button className={classes.button}>Release Dataset</Button>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    readers: state.snapshots.snapshotRequest.readers,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(ShareSnapshot));
