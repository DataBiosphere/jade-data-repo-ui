import React from 'react';
import _ from 'lodash';
import { Box, Card, CardContent, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Close, Error } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { urlEncodeParams } from 'libs/utilsTs';
import { connect } from 'react-redux';
import { TdrState } from 'reducers';
import { RouterLocation, RouterRootState } from 'connected-react-router';
import { LocationState } from 'history';

const StyledCard = styled(Card)({
  borderRadius: 5,
  backgroundColor: '#fbebe8',
  width: '100%',
  cursor: 'default',
});

const StyledText = styled(Box)(({ theme }) => ({
  alignSelf: 'center',
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  fontWeight: 600,
  padding: `0 40px 0 ${theme.spacing(2)}`,
  overflowY: 'auto',
  maxHeight: 300,
}));

const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: '12px',
  width: '24px',
  height: '24px',
  marginLeft: theme.spacing(2),
  ...theme.mixins.jadeLink,
}));

const StyledLink = styled('span')(({ theme }) => ({
  ...theme.mixins.jadeLink,
  fontSize: 14,
  fontWeight: 600,
  textDecoration: 'underline',
}));

interface ToastProps {
  errorMsg?: string;
  status?: string;
  jobId?: string;
  onDismiss: () => void;
  location: RouterLocation<LocationState>;
}

function Toast({ errorMsg, status, jobId, onDismiss, location }: ToastProps) {
  let errString;
  if (status && errorMsg) {
    errString = `Error ${status}: ${errorMsg}`;
  } else if (errorMsg) {
    errString = errorMsg;
  } else {
    errString = 'An error occurred, please try again or submit a bug report';
  }

  let jobInfoUrl = '';
  if (jobId) {
    const params = _.clone(location.query || {});
    params.expandedJob = jobId;
    jobInfoUrl = `?${urlEncodeParams({ expandedJob: jobId })}`;
  }

  return (
    <StyledCard>
      <CardContent sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Error
            sx={(theme) => ({
              fill: theme.palette.error.main,
              height: theme.spacing(4),
              width: theme.spacing(4),
            })}
          />
          <Box sx={{ position: 'relative', flex: 1 }}>
            <StyledText>
              {errString}
              {jobId && (
                <Box sx={{ paddingTop: (theme) => theme.spacing(2) }}>
                  <Link to={jobInfoUrl} onClick={onDismiss}>
                    <StyledLink>View details</StyledLink>
                  </Link>
                </Box>
              )}
            </StyledText>
            <StyledCloseButton aria-label="Close" onClick={onDismiss}>
              <Close fontSize="small" />
            </StyledCloseButton>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
}

function mapStateToProps(state: TdrState & RouterRootState) {
  return {
    location: state.router.location,
  };
}

export default connect(mapStateToProps)(Toast);
