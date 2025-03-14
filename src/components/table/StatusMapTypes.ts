import React from 'react';
import { CustomTheme } from '@mui/material/styles';

interface StatusIconProps {
  sx: React.CSSProperties;
}

export interface StatusIconWithLabel {
  icon: (props: StatusIconProps, theme: CustomTheme) => React.ReactElement;
  label: string;
}
