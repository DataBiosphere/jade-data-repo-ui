import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { CustomTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

export const EllipsisLink = styled(Link)(({ theme }) => ({
  ...(theme as CustomTheme).mixins.ellipsis,
}));

export const EllipsisSpan = styled('span')(({ theme }) => ({
  ...(theme as CustomTheme).mixins.ellipsis,
}));

export const EllipsisBox = styled(Box)(({ theme }) => ({
  ...(theme as CustomTheme).mixins.ellipsis,
}));
