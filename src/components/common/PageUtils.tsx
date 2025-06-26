import { CustomTheme, styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const Root = styled(Box)(({ theme }) => ({
  ...(theme as CustomTheme).mixins.pageRoot,
}));

export const PageTitle = styled(Typography)(({ theme }: { theme: CustomTheme }) => ({
  ...theme.mixins.pageTitle,
}));
