import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import LinearProgress from '@material-ui/core/LinearProgress';

import { clearJobId, getJobById } from 'actions/index';
import { STATUS } from 'constants/index';
import SnapshotDirectionalModal from './SnapshotDirectionalModal';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  width: {
    width: '70%',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(4),
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
  info: {
    display: 'inline-block',
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(2),
  },
  card: {
    display: 'inline-block',
    padding: theme.spacing(4),
    overflow: 'inherit',
  },
  header: {
    fontSize: theme.spacing(2),
    lineHeight: '22px',
    fontWeight: '600',
  },
  values: {
    paddingBottom: theme.spacing(3),
  },
  query: {
    flexGrow: 1,
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(8),
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    margin: 0,
    padding: theme.spacing(3),
  },
  dialogContent: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    fontFamily: theme.typography.fontFamily,
    fontSize: '20px',
    fontWeight: '500',
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    width: '600px',
  },
  actionButtons: {
    textDecoration: 'none',
    color: theme.palette.primary.contrastText,
  },
  closetitle: {
    display: 'inline-block',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1.5),
    top: theme.spacing(2),
  },
});

export class SnapshotPreviewView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    createdSnapshots: PropTypes.arrayOf(PropTypes.object),
    snapshot: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    exception: PropTypes.bool.isRequired,
    jobStatus: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
    userEmail: PropTypes.string,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { jobId } = match.params;
    dispatch(clearJobId());
    dispatch(actions.change('snapshot', {}));
    dispatch(getJobById(jobId));
  }

  render() {
    const {
      classes,
      createdSnapshots,
      snapshot,
      exception,
      jobStatus,
      match,
      userEmail,
    } = this.props;
    const { jobId } = match.params;
    const createdSnapshot = createdSnapshots.find(snapshotJob => snapshotJob.jobId === jobId);
    const jobCompleted = jobStatus === STATUS.SUCCESS || jobStatus === STATUS.ERROR;
    return (
      <div id="snapshot-preview" className={classes.wrapper}>
        <div className={classes.width}>
          {jobCompleted || !createdSnapshot ? (
            <div>
              <div className={classes.title}>Created Snapshot</div>
              <p>
                {exception || !createdSnapshot || jobStatus === STATUS.ERROR
                  ? 'Your new snapshot has not been created'
                  : 'Your new snapshot has been created!'}
              </p>
              <SnapshotDirectionalModal
                createdSnapshot={createdSnapshot && snapshot}
                success={!exception}
              />
              <div className={classes.query}>
                <LinearProgress variant="determinate" value={100} />
              </div>
            </div>
          ) : (
            <div>
              <div className={classes.title}>Create Snapshot</div>
              <p>Your new snapshot is being created.</p>
              <div className={classes.query}>
                <LinearProgress variant="query" />
              </div>
            </div>
          )}
          <div className={classes.container}>
            <div className={classes.info}>
              <div className={classes.header}> Snapshot Name: </div>
              {createdSnapshot && jobCompleted && snapshot ? (
                <div>
                  <Link to={`/snapshots/details/${snapshot.id}`}>
                    {createdSnapshot.snapshotRequest.name}
                  </Link>
                </div>
              ) : (
                <div className={classes.values}>
                  {createdSnapshot &&
                    createdSnapshot.snapshotRequest &&
                    createdSnapshot.snapshotRequest.name}
                </div>
              )}
              <div className={classes.header}> Description: </div>
              <div className={classes.values}>
                {createdSnapshot &&
                  createdSnapshot.snapshotRequest &&
                  createdSnapshot.snapshotRequest.description}
              </div>
            </div>
            <Card className={classes.card}>
              <div className={classes.header}> Custodian(s): </div>
              <div className={classes.values}> {userEmail} </div>
              <div className={classes.header}> Access: </div>
              <div className={classes.values}>
                {createdSnapshot &&
                  createdSnapshot.snapshotRequest &&
                  createdSnapshot.snapshotRequest.readers &&
                  createdSnapshot.snapshotRequest.readers.map(reader => (
                    <div key={reader}> {reader} </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    createdSnapshots: state.snapshots.createdSnapshots,
    snapshot: state.snapshots.snapshot,
    jobStatus: state.jobs.jobStatus,
    userEmail: state.user.email,
    exception: state.snapshots.exception,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotPreviewView));
