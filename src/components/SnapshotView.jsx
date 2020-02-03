import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';

import SnapshotTable from './table/SnapshotTable';
import Add from './icons/Add';
import SnapshotPopup from './snapshot/SnapshotPopup';

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
});

class SnapshotView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;
    return (
      <div id="snapshots" className={classes.wrapper}>
        <div className={classes.width}>
          <div className={classes.title}>
            Snapshots
          </div>
          <div>
            <SnapshotTable />
          </div>
        </div>
        <SnapshotPopup />
      </div>
    );
  }
}

export default withStyles(styles)(SnapshotView);
