import React from 'react';
import { makeStyles } from '@mui/styles';
import Tooltip from '@mui/material/Tooltip';
import { TooltipProps } from '@mui/material/Tooltip/Tooltip';
import { CustomTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme: CustomTheme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontSize: theme.typography.body1.fontSize,
  },
}));

type TerraTooltipProps = TooltipProps & {
  disabled?: boolean;
};

function TerraTooltip(props: TerraTooltipProps) {
  const classes = useStyles();
  const { disabled, children } = props;
  if (disabled) {
    return children;
  }
  return <Tooltip arrow classes={classes} {...props} />;
}

export default TerraTooltip;
