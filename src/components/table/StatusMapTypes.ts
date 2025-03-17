import React from 'react';
import { CustomTheme } from '@mui/material/styles';

interface StatusIconProps {
  sx: React.CSSProperties;
}

export interface StatusIconWithLabel {
  icon: (props: StatusIconProps) => React.ReactElement;
  label: string;
}
