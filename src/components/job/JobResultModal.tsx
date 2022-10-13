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
import clsx from 'clsx';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { ReactJson } from 'react-json-view';
import { Property } from 'csstype';
import { getJobResult } from 'actions';
import { TdrState } from 'reducers';
import { JobResult, JobResultError } from 'reducers/job';
import LoadingSpinner from '../common/LoadingSpinner';

const styles = (theme: CustomTheme) => ({
  root: {
    boxShadow: 'none',
    maxHeight: '100%',
    position: 'relative' as Property.Position,
  },
  seeMoreLink: {
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.hover,
    },
  },
  dialogTitle: {
    margin: 0,
    marginTop: '5px',
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
  detailRow: {
    padding: '20px 0',
    borderTop: '1px solid rgba(0,0,0,0.2)',
    'word-break': 'break-all',
  },
  detailRowFirst: {
    borderTop: 0,
    paddingTop: 0,
  },
});

type JobResultModalProps = {
  classes: ClassNameMap;
  dispatch: Dispatch<Action>;
  id: string;
  description?: string;
  loading: boolean;
  jobResult?: JobResult;
  linkDisplay?: any;
};

function JobResultModal({
  classes,
  dispatch,
  id,
  description,
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
    jobResult && jobResult.resultType === 'error' ? (jobResult.result as JobResultError) : null;

  const jobSuccess =
    jobResult && jobResult.resultType === 'success' ? (jobResult.result as any) : null;

  console.log('types', typeof jobResult?.result);

  return (
    <div>
      <button type="button" onClick={handleSeeMoreOpen} className={classes.seeMoreLink}>
        {linkDisplay}
      </button>
      <Paper className={classes.root}>
        <Dialog open={seeMore.open} scroll="paper" fullWidth={true}>
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
                    <div className={classes.dialogLabel}>Description</div>
                    <div className={classes.dialogContent}>{description}</div>
                  </div>

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
                            {jobError.detail.map((detail, i) => (
                              <div
                                className={clsx(classes.detailRow, {
                                  [classes.detailRowFirst]: i === 0,
                                })}
                                key={`${id}-details-${i}`}
                              >
                                {detail}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {jobSuccess && (
                    <>
                      {_.keys(jobSuccess).map((key) => (
                        <div className={classes.dialogInfo} key={`${id}-details-${key}`}>
                          <div className={classes.dialogLabel}>{key}</div>
                          <div className={classes.dialogContent}>
                            {JSON.stringify(jobSuccess[key])}
                          </div>
                        </div>
                      ))}
                    </>
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
