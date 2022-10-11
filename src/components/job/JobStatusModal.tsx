import React, { useState, useEffect, Dispatch } from 'react';
import _ from 'lodash';
import { ClassNameMap, withStyles } from '@mui/styles';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { Property } from 'csstype';
import { getJobResult } from 'actions';
import { TdrState } from 'reducers';
import LoadingSpinner from '../common/LoadingSpinner';

const styles = () => ({
  root: {
    boxShadow: 'none',
    maxHeight: '100%',
    position: 'relative' as Property.Position,
  },
  seeMoreLink: {
    display: 'block',
  },
});

type JobStatusModalProps = {
  classes: ClassNameMap;
  dispatch: Dispatch<Action>;
  id: string;
  errMessage?: string;
  errDetail?: string[];
};

function JobStatusModal({ classes, dispatch, id, errMessage, errDetail }: JobStatusModalProps) {
  const [seeMore, setSeeMore] = useState({ open: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seeMore.open) {
      setLoading(true);
      console.log('setting loading true, then dispatching');
      dispatch(getJobResult({ id }));
      setLoading(false);
      console.log('set loading to false');
    }
  }, [dispatch, seeMore, id]);

  const handleSeeMoreOpen = () => {
    setSeeMore({ open: true });
  };

  const handleSeeMoreClose = () => {
    setSeeMore({ open: false });
  };

  return (
    <div>
      <button type="button" onClick={handleSeeMoreOpen} className={classes.seeMoreLink}>
        See More
      </button>
      {!loading && (
        <Paper className={classes.root}>
          <Dialog open={seeMore.open} scroll="paper">
            <DialogTitle id="see-more-dialog-title">
              <Typography variant="h3" style={{ float: 'left' }}>
                {errMessage}
              </Typography>
              <IconButton size="small" style={{ float: 'right' }} onClick={handleSeeMoreClose}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers={true}>
              <DialogContentText
                className={classes.dialogContentText}
                component="div"
                id="see-more-dialog-content-text"
              >
                {JSON.stringify(errDetail)}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </Paper>
      )}
      {loading && <LoadingSpinner />}
    </div>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    errMessage: state.jobs.jobResultErrorMessage,
    errDetail: state.jobs.jobResultErrorDetail,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(JobStatusModal));
