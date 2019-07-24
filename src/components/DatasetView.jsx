import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';

import DatasetTable from './table/DatasetTable';
import Add from './icons/Add';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  width: {
    width: '70%',
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: 54,
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
  plusButton: {
    fill: theme.palette.common.link,
    marginLeft: theme.spacing(4),
    width: theme.spacing(3),
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
          <div className={classes.title}>
            Datasets
            <NavLink to="/datasets/create">
              <Tooltip title="Create a new dataset" enterDelay={100}>
                <Add className={classes.plusButton} />
              </Tooltip>
            </NavLink>
          </div>
          <div>
            <DatasetTable />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DatasetView);
