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
import DatasetDirectionalModal from './DatasetDirectionalModal';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 4,
  },
  width: {
    width: '70%',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.unit * 4,
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing.unit * 8,
  },
  info: {
    display: 'inline-block',
    paddingTop: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 2,
  },
  card: {
    display: 'inline-block',
    padding: theme.spacing.unit * 4,
    overflow: 'inherit',
  },
  header: {
    fontSize: theme.spacing.unit * 2,
    lineHeight: '22px',
    fontWeight: '600',
  },
  values: {
    paddingBottom: theme.spacing.unit * 3,
  },
  query: {
    flexGrow: 1,
    paddingBottom: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 8,
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    margin: 0,
    padding: theme.spacing.unit * 3,
  },
  dialogContent: {
    paddingBottom: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 4,
    fontFamily: theme.typography.fontFamily,
    fontSize: '20px',
    fontWeight: '500',
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
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
    right: theme.spacing.unit * 1.5,
    top: theme.spacing.unit * 2,
  },
});

export class DatasetPreviewView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    createdDataset: PropTypes.object,
    createdDatasets: PropTypes.arrayOf(PropTypes.object),
    dispatch: PropTypes.func.isRequired,
    exception: PropTypes.bool.isRequired,
    jobStatus: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
    userEmail: PropTypes.string,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const jobId = match.params.jobId;
    dispatch(clearJobId());
    dispatch(actions.change('dataset', {}));
    dispatch(getJobById(jobId));
  }

  render() {
    const { classes, createdDatasets, exception, jobStatus, match, userEmail } = this.props;
    const jobId = match.params.jobId;
    const createdDataset = createdDatasets.find(datasetJob => datasetJob.jobId === jobId);
    const jobCompleted = jobStatus === STATUS.SUCCESS || jobStatus === STATUS.ERROR;
    return (
      <div id="dataset-preview" className={classes.wrapper}>
        <div className={classes.width}>
          {jobCompleted ? (
            <div>
              <div className={classes.title}>Created Dataset</div>
              <p>
                {exception || !createdDataset || jobStatus === STATUS.ERROR
                  ? 'Your new dataset has not been created'
                  : 'Your new dataset has been created!'}
              </p>
              <DatasetDirectionalModal
                createdDataset={createdDataset.dataset}
                success={!exception}
              />
              <div className={classes.query}>
                <LinearProgress variant="determinate" value={100} />
              </div>
            </div>
          ) : (
            <div>
              <div className={classes.title}>Create Dataset</div>
              <p>Your new dataset is being created.</p>
              <div className={classes.query}>
                <LinearProgress variant="query" />
              </div>
            </div>
          )}
          <div className={classes.container}>
            <div className={classes.info}>
              <div className={classes.header}> Dataset Name: </div>
              {createdDataset && jobCompleted ? (
                <div>
                  <Link to={`/datasets/details/${createdDataset.dataset.id}`}>
                    {createdDataset.dataset.name}
                  </Link>
                </div>
              ) : (
                <div className={classes.values}>{createdDataset.dataset.name}</div>
              )}
              <div className={classes.header}> Description: </div>
              <div className={classes.values}> {createdDataset.dataset.description} </div>
            </div>
            <Card className={classes.card}>
              <div className={classes.header}> Custodian(s): </div>
              <div className={classes.values}> {userEmail} </div>
              <div className={classes.header}> Access: </div>
              <div className={classes.values}>
                {createdDataset.dataset &&
                  createdDataset.dataset.readers &&
                  createdDataset.dataset.readers.map(reader => <div> {reader} </div>)}
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
    createdDatasets: state.datasets.createdDatasets,
    jobStatus: state.jobs.jobStatus,
    userEmail: state.user.email,
    exception: state.datasets.exception,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetPreviewView));
