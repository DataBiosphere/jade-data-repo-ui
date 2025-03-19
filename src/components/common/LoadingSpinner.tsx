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
  readonly wrapperStyles?: React.CSSProperties;
  readonly size?: number | string;
  readonly className?: string;
  readonly delay?: boolean;
  readonly delayMessage?: string;
};

function LoadingSpinner({
  wrapperStyles,
  size,
  className,
  delay,
  delayMessage,
}: LoadingSpinnerProps) {
  return (
    <SpinWrapper className={className} sx={wrapperStyles}>
      <CircularProgress sx={{ margin: 'auto' }} size={size} />
      {delay && delayMessage}
    </SpinWrapper>
  );
}

export default LoadingSpinner;
