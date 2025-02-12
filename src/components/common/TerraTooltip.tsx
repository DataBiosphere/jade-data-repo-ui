import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { TooltipProps } from '@mui/material/Tooltip/Tooltip';

type TerraTooltipProps = TooltipProps & {
  disabled?: boolean;
};

function TerraTooltip(props: TerraTooltipProps) {
  const { disabled, children, ...otherProps } = props;

  if (disabled) {
    return children;
  }

  return (
    <Tooltip
      arrow
      componentsProps={{
        arrow: {
          sx: { color: (theme) => theme.palette.common.black },
        },
        tooltip: {
          sx: {
            backgroundColor: (theme) => theme.palette.common.black,
            // @ts-ignore
            fontSize: (theme) => theme.typography.body1.fontSize,
          },
        },
      }}
      {...otherProps}
    >
      {children}
    </Tooltip>
  );
}

export default TerraTooltip;
