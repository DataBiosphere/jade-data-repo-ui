import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';

const styles = (theme) => ({
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    padding: theme.spacing(4),
  },
  section: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    margin: `${theme.spacing(1)}px 0px`,
  },
});

class DataExplorerView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.title}>Data Explorer</div>
        <div className={classes.section}>This is where the filter options will go</div>
        <Divider />
        <div className={classes.section}>This is where the applied filters will go</div>
        <Divider />
        <div className={classes.section}>This is where the dataset results will go</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(withStyles(styles)(DataExplorerView));
