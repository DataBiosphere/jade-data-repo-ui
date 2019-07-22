import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link, NavLink } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';

import DatasetTable from './table/DatasetTable';
import StudyTable from './table/StudyTable';
import Add from './icons/Add';

const styles = theme => ({
  header: {
    alignItems: 'center',
    color: theme.typography.color,
    display: 'flex',
    fontWeight: 500,
    fontSize: 16,
    height: 21,
    letterSpacing: 1,
  },
  jadeTableSpacer: {
    paddingBottom: theme.spacing(12),
  },
  jadeLink: {
    color: theme.palette.common.link,
    float: 'right',
    fontSize: 16,
    fontWeight: 500,
    height: 20,
    letterSpacing: 0.3,
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(4),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  plusButton: {
    height: 20,
    fill: theme.palette.common.link,
    marginLeft: 10,
    width: 20,
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
  wrapper: {
    display: 'flex',
    fontFamily: theme.typography.fontFamily,
    justifyContent: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  width: {
    width: '70%',
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
          <div className={classes.header}> RECENT STUDIES </div>
          <StudyTable summary />
          <div>
            <Link to="/studies" className={classes.jadeLink}>
              See all Studies
            </Link>
          </div>
          <div className={classes.jadeTableSpacer} />
          <div className={classes.header}>
            RECENT DATASETS
            <NavLink to="/datasets/create">
              <Tooltip title="Create a new dataset" enterDelay={100}>
                <Add className={classes.plusButton} />
              </Tooltip>
            </NavLink>
          </div>
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
