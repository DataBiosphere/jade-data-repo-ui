import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import StudyTable from './table/StudyTable';
import DatasetTable from './table/DatasetTable';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    fontFamily: theme.typography.fontFamily,
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
  jadeTableSpacer: {
    paddingBottom: theme.spacing.unit * 8,
  },
});

class HomeView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    studies: PropTypes.object,
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        <div className={classes.width}>
          <div className={classes.title}>Terra Data Repository at a glance</div>
          <StudyTable summary />
          <div className={classes.jadeTableSpacer} />
          <DatasetTable summary />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HomeView);
