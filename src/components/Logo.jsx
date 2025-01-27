import React from 'react';
import { Box, Typography } from '@mui/material';
import { sizeHeight, styled } from '@mui/system';
import { push } from 'modules/hist';

import TerraIcon from 'media/brand/logo-wShadow.svg?react';

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: '#fff',
  fontFamily: theme.typography.fontFamily,
  fontSize: '18px',
  fontWeight: '500',
  paddingLeft: theme.spacing(1),
}));

const StyledTerraIcon = styled(TerraIcon)(({ theme }) => ({
  alignItems: 'flex-start',
  display: 'inline-flex',
  height: theme.spacing(8),
}));

function Logo() {
  const handleGoHome = () => {
    push('/');
  };

  return (
    <Box
      onClick={handleGoHome}
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <StyledTerraIcon alt="logo" />
      <StyledTitle>Data Repository</StyledTitle>
    </Box>
  );
}

export default Logo;
