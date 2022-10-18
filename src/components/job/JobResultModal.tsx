import React, { useState, useEffect, Dispatch } from 'react';
import _ from 'lodash';
import { ClassNameMap, withStyles } from '@mui/styles';
import {
  CustomTheme,
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
import LoadingSpinner from '../common/LoadingSpinner';

const styles = (theme: CustomTheme) => ({
  seeMoreLink: {
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.hover,
    },
  },
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
  id: string;
  description?: string;
  jobClass?: string;
  loading: boolean;
  jobResult?: JobResult;
  linkDisplay?: any;
};

function JobResultModal({
  classes,
  dispatch,
  id,
  description,
  jobClass,
  loading,
  jobResult,
  linkDisplay = 'See More',
}: JobResultModalProps) {
  const [seeMore, setSeeMore] = useState({ open: false });

  useEffect(() => {
    if (seeMore.open) {
      dispatch(getJobResult({ id }));
    }
  }, [dispatch, seeMore, id]);

  const handleSeeMoreOpen = () => {
    setSeeMore({ open: true });
  };

  const handleSeeMoreClose = () => {
    setSeeMore({ open: false });
  };

  const jobError =
    jobResult && jobResult.resultType === JobModelJobStatusEnum.Failed
      ? (jobResult.result as JobResultError)
      : null;

  const jobSuccess =
    jobResult &&
    (jobResult.resultType === JobModelJobStatusEnum.Succeeded ||
      jobResult.resultType === JobModelJobStatusEnum.Running)
      ? (jobResult.result as any)
      : null;

  return (
    <div>
      <button type="button" onClick={handleSeeMoreOpen} className={classes.seeMoreLink}>
        {linkDisplay}
      </button>
      <Paper className={classes.root}>
        <Dialog
          open={seeMore.open}
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
                    <div className={classes.dialogContent}>{id}</div>
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
    </div>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    loading: state.jobs.jobResultLoading,
    jobResult: state.jobs.jobResult,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(JobResultModal));
