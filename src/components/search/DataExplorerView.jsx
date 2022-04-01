import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { Divider } from '@mui/material';

const styles = (theme) => ({
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    padding: theme.spacing(4),
  },
  section: {
    padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
    margin: `${theme.spacing(1)} 0px`,
  },
});

class DataExplorerView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
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
