import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    height: '100%',
  },
  headerText: {
    fontWeight: theme.typography.bold,
    textTransform: 'uppercase',
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
