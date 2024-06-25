import React, { useEffect, Dispatch } from 'react';
import _ from 'lodash';
import { ClassNameMap, withStyles } from '@mui/styles';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Action } from 'redux';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view';
import { getJobResult } from 'actions';
import { TdrState } from 'reducers';
import { JobModelJobStatusEnum } from 'generated/tdr';
import { JobResult, JobResultError } from 'reducers/job';
import { RouterLocation, RouterRootState } from 'connected-react-router';
import { LocationState } from 'history';
import { push } from 'modules/hist';
import LoadingSpinner from '../common/LoadingSpinner';
import CopyTextButton from '../common/CopyTextButton';

const styles = () => ({
  dialog: {
    minHeight: '80vh',
    maxHeight: '80vh',
    width: '80%',
    maxWidth: 800,
  },
  dialogTitle: {
    margin: 0,
    marginTop: '5px',
    fontSize: '1.2rem',
  },
  dialogInfo: {
    display: 'flex',
    marginBottom: 10,
  },
  dialogLabel: {
    fontWeight: 'bold',
    minWidth: 100,
    'text-align': 'right',
    marginRight: 15,
  },
  dialogContent: {
    'word-break': 'break-all',
  },
});

type JobResultModalProps = {
  classes: ClassNameMap;
  dispatch: Dispatch<Action>;
  loading: boolean;
  jobResult?: JobResult;
  location: RouterLocation<LocationState>;
};

function JobResultModal({ classes, dispatch, loading, jobResult, location }: JobResultModalProps) {
  const expandedJob = location.query?.expandedJob;
  useEffect(() => {
    if (expandedJob) {
      dispatch(getJobResult({ id: expandedJob }));
    }
  }, [dispatch, expandedJob]);

  const handleSeeMoreClose = () => {
    push(`${location.pathname}`);
  };

  const jobError =
    jobResult && jobResult.resultType === JobModelJobStatusEnum.Failed
      ? (jobResult.result as JobResultError)
      : null;

  const jobSuccess =
    jobResult && jobResult.resultType === JobModelJobStatusEnum.Succeeded
      ? (jobResult.result as any)
      : null;

  const description = jobResult?.jobInfo?.description;
  const jobClass = jobResult?.jobInfo?.class_name;
  return (
    <Paper className={classes.root}>
      <Dialog
        open={!!expandedJob}
        scroll="paper"
        fullWidth={true}
        classes={{ paper: classes.dialog }}
        onBackdropClick={handleSeeMoreClose}
      >
        <DialogTitle id="see-more-dialog-title">
          <div className={classes.dialogTitle} style={{ float: 'left' }}>
            Job Details
          </div>
          <IconButton size="small" style={{ float: 'right' }} onClick={handleSeeMoreClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            className={classes.dialogContentText}
            component="div"
            id="see-more-dialog-content-text"
          >
            {loading && <LoadingSpinner />}
            {!loading && (
              <div>
                <div className={classes.dialogInfo}>
                  <div className={classes.dialogLabel}>ID</div>
                  <div className={classes.dialogContent}>
                    <span style={{ marginRight: '10px' }}>{expandedJob}</span>
                    <CopyTextButton valueToCopy={expandedJob} nameOfValue="Job ID" />
                  </div>
                </div>

                <div className={classes.dialogInfo}>
                  <div className={classes.dialogLabel}>Class Name</div>
                  <div className={classes.dialogContent}>{jobClass}</div>
                </div>

                {description && (
                  <div className={classes.dialogInfo}>
                    <div className={classes.dialogLabel}>Description</div>
                    <div className={classes.dialogContent}>{description}</div>
                  </div>
                )}

                {jobError && (
                  <>
                    <div className={classes.dialogInfo}>
                      <div className={classes.dialogLabel}>Message</div>
                      <div className={classes.dialogContent}>{jobError.message}</div>
                    </div>

                    {jobError.detail && jobError.detail.length > 0 && (
                      <div className={classes.dialogInfo}>
                        <div className={classes.dialogLabel}>Details</div>
                        <div className={classes.dialogContent}>
                          {jobError.detail && <ReactJson src={jobError.detail} />}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {jobSuccess && (
                  <div className={classes.dialogInfo}>
                    <div className={classes.dialogLabel}>Content</div>
                    <div className={classes.dialogContent}>
                      {_.isString(jobSuccess) ? jobSuccess : <ReactJson src={jobSuccess} />}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

function mapStateToProps(state: TdrState & RouterRootState) {
  return {
    loading: state.jobs.jobResultLoading,
    jobResult: state.jobs.jobResult,
    location: state.router.location,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(JobResultModal));
