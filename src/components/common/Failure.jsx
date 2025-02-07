import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

import ErrorIcon from 'media/icons/warning-standard-solid.svg?react';

// Use styled component for text since it has >3 styles
const StyledText = styled(Box)(({ theme }) => ({
  alignSelf: 'center',
  fontFamily: theme.typography.fontFamily,
  fontSize: '12px',
  fontWeight: 600,
  padding: `0 0 0 ${theme.spacing(2)}`,
}));

function Failure({ errString }) {
  // Use sx prop for icon since it has ≤3 styles
  return (
    <Box>
      <ErrorIcon
        sx={{
          fill: (theme) => theme.palette.primary.contrastText,
          height: (theme) => theme.spacing(4),
        }}
        alt="logo"
      />
      <StyledText>{errString}</StyledText>
    </Box>
  );
}

Failure.propTypes = {
  errString: PropTypes.string,
};

export default Failure;
