import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import DatasetTable from './table/DatasetTable';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 4,
  },
  width: {
    width: '70%',
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing.unit * 8,
  },
});

class DatasetView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;
    return (
      <div id="datasets" className={classes.wrapper}>
        <div className={classes.width}>
          <div className={classes.title}>Datasets</div>
          <p> Datasets make access control simple </p>
          <div>
            <DatasetTable />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DatasetView);
