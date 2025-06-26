import React, { useEffect, Dispatch } from 'react';
import _ from 'lodash';
import { ClassNameMap } from '@mui/styles';
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
import { styled } from '@mui/material/styles';
import LoadingSpinner from '../common/LoadingSpinner';
import CopyTextButton from '../common/CopyTextButton';

const dialogStyles = {
  minHeight: '80vh',
  maxHeight: '80vh',
  width: '80%',
  maxWidth: 800,
};

const DialogTitleText = styled('div')(() => ({
  margin: 0,
  marginTop: '5px',
  fontSize: '1.2rem',
  float: 'left',
}));

const JadeDialogInfo = styled('div')(() => ({
  display: 'flex',
  marginBottom: 10,
}));

const JadeDialogContent = styled('div')(() => ({
  'word-break': 'break-all',
}));

const JadeDialogLabel = styled('div')(() => ({
  fontWeight: 'bold',
  minWidth: 100,
  'text-align': 'right',
  marginRight: 15,
}));

type JobResultModalProps = {
  dispatch: Dispatch<Action>;
  loading: boolean;
  jobResult?: JobResult;
  location: RouterLocation<LocationState>;
};

function JobResultModal({ dispatch, loading, jobResult, location }: JobResultModalProps) {
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
    <Paper>
      <Dialog
        open={!!expandedJob}
        scroll="paper"
        fullWidth={true}
        paperProps={{ sx: dialogStyles }}
        onBackdropClick={handleSeeMoreClose}
      >
        <DialogTitle id="see-more-dialog-title">
          <DialogTitleText>Job Details</DialogTitleText>
          <IconButton size="small" style={{ float: 'right' }} onClick={handleSeeMoreClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              'word-break': 'break-all',
            }}
            component="div"
            id="see-more-dialog-content-text"
          >
            {loading && <LoadingSpinner />}
            {!loading && (
              <div>
                <JadeDialogInfo>
                  <JadeDialogLabel>ID</JadeDialogLabel>
                  <JadeDialogContent>
                    <span style={{ marginRight: '10px' }}>{expandedJob}</span>
                    <CopyTextButton valueToCopy={expandedJob} nameOfValue="Job ID" />
                  </JadeDialogContent>
                </JadeDialogInfo>

                <JadeDialogInfo>
                  <JadeDialogLabel>Class Name</JadeDialogLabel>
                  <JadeDialogContent>{jobClass}</JadeDialogContent>
                </JadeDialogInfo>

                {description && (
                  <JadeDialogInfo>
                    <JadeDialogLabel>Description</JadeDialogLabel>
                    <JadeDialogContent>{description}</JadeDialogContent>
                  </JadeDialogInfo>
                )}

                {jobError && (
                  <>
                    <JadeDialogInfo>
                      <JadeDialogLabel>Message</JadeDialogLabel>
                      <JadeDialogContent>{jobError.message}</JadeDialogContent>
                    </JadeDialogInfo>

                    {jobError.detail && jobError.detail.length > 0 && (
                      <JadeDialogInfo>
                        <JadeDialogLabel>Details</JadeDialogLabel>
                        <JadeDialogContent>
                          {jobError.detail && <ReactJson src={jobError.detail} />}
                        </JadeDialogContent>
                      </JadeDialogInfo>
                    )}
                  </>
                )}

                {jobSuccess && (
                  <JadeDialogInfo>
                    <JadeDialogLabel>Content</JadeDialogLabel>
                    <JadeDialogContent>
                      {_.isString(jobSuccess) ? jobSuccess : <ReactJson src={jobSuccess} />}
                    </JadeDialogContent>
                  </JadeDialogInfo>
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

export default connect(mapStateToProps)(JobResultModal);
