import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { getDatasets, getStudies } from 'actions/index';
import DatasetTable from './table/DatasetTable';
import StudyTable from './table/StudyTable';

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
  jadeLink: {
    color: theme.palette.primary.main,
    float: 'right',
    fontSize: 16,
    fontWeight: 500,
    height: 20,
    letterSpacing: 0.3,
    paddingLeft: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 4,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
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
          <div>
            <Link to="/studies" className={classes.jadeLink}>
              See all Studies
            </Link>
          </div>
          <div className={classes.jadeTableSpacer} />
          <DatasetTable summary />
          <div>
            <Link to="/datasets" className={classes.jadeLink}>
              See all Datasets
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HomeView);
