import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const JadeLink = styled(Box)(({ theme }) => ({
  ...theme.mixins.jadeLink,
}));

export const JadeLinkInline = styled('span')(({ theme }) => ({
  ...theme.mixins.jadeLink,
}));
