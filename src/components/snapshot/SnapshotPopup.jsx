import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { ReactComponent as ExitSVG } from 'media/icons/times-light.svg';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
} from '@material-ui/core';
import { CameraAlt, Today } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { openSnapshotDialog, getSnapshotById, getSnapshotPolicy } from 'actions/index';
import { push } from 'modules/hist';

const styles = (theme) => ({
  snapshotName: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: '4px 4px 0px 0px',
  },
  content: {
    padding: theme.spacing(2),
  },
  withIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  inline: {
    marginRight: theme.spacing(1),
  },
  actions: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
    textAlign: 'end',
  },
  listItem: {
    listStyleType: 'none',
    marginBottom: theme.spacing(1),
  },
  bodyText: {
    paddingBottom: theme.spacing(2),
  },
  light: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  chip: {
    backgroundColor: theme.palette.primary.light,
    margin: theme.spacing(0.5),
    marginLeft: '0px',
  },
  centered: {
    textAlign: 'center',
  },
  exitButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '1em',
    width: '3em',
    height: '3em',
    cursor: 'pointer',
    ...theme.mixins.jadeLink,
  },
  title: {
    marginTop: '10px',
    marginRight: '16px',
    paddingBottom: '15px',
  },
  jadeLink: {
    ...theme.mixins.jadeLink,
  },
});

export class SnapshotPopup extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    filterData: PropTypes.object,
    isOpen: PropTypes.bool,
    policies: PropTypes.arrayOf(PropTypes.object),
    snapshot: PropTypes.object,
  };

  /**
   * When a snapshot gets created, the empty snapshot prop gets populated with a brief summary.
   * We want to use that snapshot id to get the full object and the policies for the dialog.
   */
  componentDidUpdate(prevProps) {
    const { dispatch, snapshot, policies } = this.props;
    if (_.isEmpty(prevProps.snapshot) && !_.isEmpty(snapshot)) {
      dispatch(getSnapshotById(snapshot.id));
      dispatch(getSnapshotPolicy(snapshot.id));
    }
    if (_.isEmpty(prevProps.policies) && !_.isEmpty(policies)) {
      push('/snapshots');
    }
  }

  handleClose = () => {
    const { dispatch } = this.props;
    dispatch(openSnapshotDialog(false));
  };

  render() {
    const { classes, filterData, isOpen, snapshot, policies } = this.props;

    const notReady = _.some([snapshot, policies, snapshot.source, snapshot.tables], _.isEmpty);
    if (notReady) {
      return (
        <Dialog open={isOpen}>
          <DialogTitle>
            <Typography variant="h5">Your data snapshot is being created</Typography>
          </DialogTitle>
          <DialogContent>
            {/* TODO: Make this loading state more descriptive */}
            <div className={clsx(classes.centered, classes.content)}>
              <CircularProgress />
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    // this number represents the total rows in the snapshot, i.e. the sum over all tables
    const rows = snapshot.tables.map((t) => t.rowCount).reduce((a, b) => a + b);
    const rowLabel = rows === 1 ? 'Row' : 'Rows';

    const tables = _.keys(filterData).map((table, i) => {
      const filters = _.get(filterData, table);
      const properties = _.keys(filters).map((filter, j) => {
        const data = _.get(filters, filter);
        let dataString = data.value;
        let dataDisplay;
        if (data.type === 'range') {
          const enDash = ' \u2013 ';
          dataString = _.join(data.value, enDash);
          const label = `${filter}: ${dataString}`;
          dataDisplay = <Chip key={j} className={classes.chip} label={label} />;
        } else {
          if (_.isPlainObject(data.value)) {
            dataString = _.keys(data.value);
          }
          dataDisplay = dataString.map((selection, k) => {
            const label = `${filter}: ${selection}`;
            return <Chip key={k} className={classes.chip} label={label} />;
          });
        }
        return dataDisplay;
      });
      return (
        <div className={classes.bodyText} key={i}>
          <div className={classes.light}>{table}</div>
          <div>{properties}</div>
        </div>
      );
    });

    const readers = policies.find((p) => p.name === 'reader').members;

    return (
      <Dialog open={isOpen} onClose={this.handleClose}>
        <div className={classes.exitButton} onClick={this.handleClose}>
          <ExitSVG />
        </div>
        <DialogContent>
          <Typography variant="h4" className={classes.title}>
            Snapshot Successfully Created
          </Typography>
          <Paper variant="outlined">
            <div className={clsx(classes.snapshotName, classes.content, classes.withIcon)}>
              <CameraAlt className={classes.inline} />
              <Typography variant="h6" data-cy="snapshotName">
                {snapshot.name}
              </Typography>
            </div>
            <div className={classes.content}>
              <div className={classes.bodyText}>
                <Typography variant="h6">
                  {rows.toLocaleString()} {rowLabel}
                </Typography>
              </div>
              {!_.isEmpty(tables) && (
                <Typography variant="subtitle1" color="primary">
                  Properties
                </Typography>
              )}
              <div>{tables}</div>
              {!_.isEmpty(readers) && (
                <Typography variant="subtitle1" color="primary">
                  Shared With
                </Typography>
              )}
              <div className={classes.bodyText} data-cy="snapshotReaders">
                {readers.map((r) => (
                  <li key={r} className={classes.listItem}>
                    {r}
                  </li>
                ))}
              </div>
              <div className={clsx(classes.light, classes.withIcon)}>
                <Today className={classes.inline} />
                {new Date(snapshot.createdDate).toLocaleString()}
              </div>
            </div>
          </Paper>
          <div className={classes.actions}>
            <Button className={classes.jadeLink} color="primary">
              <Link to={`/snapshots/details/${snapshot.id}`}>Go to Snapshot Details Page</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.snapshots.dialogIsOpen,
    filterData: state.query.filterData,
    snapshot: state.snapshots.snapshot,
    policies: state.snapshots.snapshotPolicies,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotPopup));
