import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';

export const JadeLink = styled(Box)(({ theme }) => ({
  ...(theme as CustomTheme).mixins.jadeLink,
}));

export const JadeLinkInline = styled('span')(({ theme }) => ({
  ...(theme as CustomTheme).mixins.jadeLink,
}));
