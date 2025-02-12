import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const SpinWrapper = styled(Box)(() => ({
  height: 'calc(100% - 60px)',
  display: 'grid',
  width: '500px',
  textAlign: 'center',
  margin: 'auto',
}));

type LoadingSpinnerProps = {
  className?: string;
  delay?: boolean;
  delayMessage?: string;
};

function LoadingSpinner({ className, delay, delayMessage }: LoadingSpinnerProps) {
  return (
    <SpinWrapper className={className}>
      <CircularProgress sx={{ margin: 'auto' }} />
      {delay && delayMessage}
    </SpinWrapper>
  );
}

export default LoadingSpinner;
