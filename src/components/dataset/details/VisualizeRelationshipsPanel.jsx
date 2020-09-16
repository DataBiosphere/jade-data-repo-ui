import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Launch } from '@material-ui/icons';

const styles = (theme) => ({
  root: {
    height: '100%',
  },
  headerText: {
    fontWeight: theme.typography.bold,
    textTransform: 'uppercase',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: `${theme.spacing(2)}px 0px`,
  },
  jadeLink: {
    color: theme.palette.common.link,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    alignItems: 'center',
    display: 'flex',
  },
  button: {
    color: theme.palette.common.link,
    border: `1px solid ${theme.palette.common.link}`,
  },
});

export class VisualizeRelationshipsPanel extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
  };

  render() {
    const { classes } = this.props;
    return <Paper className={classes.root} />;
  }
}

export default withStyles(styles)(VisualizeRelationshipsPanel);
