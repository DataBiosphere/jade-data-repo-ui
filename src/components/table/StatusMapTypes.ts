import React from 'react';

interface StatusIconProps {
  sx: React.CSSProperties;
}

export interface StatusIconWithLabel {
  icon: (props: StatusIconProps) => React.ReactElement;
  label: string;
}
