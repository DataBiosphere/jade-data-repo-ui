import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontSize: theme.typography.body1.fontSize,
  },
}));

function TerraTooltip(props) {
  const classes = useStyles();
  return <Tooltip arrow classes={classes} {...props} />;
}

export default TerraTooltip;
