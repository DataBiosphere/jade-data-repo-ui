import { styled, CustomTheme } from '@mui/material/styles';

const Container = styled('div')(({ theme }: { theme: CustomTheme }) => theme.mixins.containerWidth);
export default Container;
