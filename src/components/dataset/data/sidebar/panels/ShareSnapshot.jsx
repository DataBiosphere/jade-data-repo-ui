import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import {
  Autocomplete,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { isEmail } from 'validator';
import { createSnapshot } from 'actions/index';
import SnapshotAccess from 'components/snapshot/SnapshotAccess';

const drawerWidth = 600;
const sidebarWidth = 56;

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
    width: drawerWidth,
  },
  section: {
    margin: `${theme.spacing(1)} 0px`,
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
    padding: `0 ${theme.spacing(1)}`,
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
    readers: PropTypes.arrayOf(PropTypes.string),
    setIsSharing: PropTypes.func,
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
        <SnapshotAccess createMode={true} />
        {!isModal && (
          <div className={classes.bottom}>
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
