import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link, NavLink } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';

import DatasetTable from './table/DatasetTable';
import StudyTable from './table/StudyTable';
import AddSVG from '../../assets/media/icons/plus-circle-solid.svg';

const styles = theme => ({
  header: {
    fontWeight: 500,
    height: 21,
    color: '#333F52',
    fontSize: 16,
    letterSpacing: 1,
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
  plusButton: {
    height: 20,
    fill: theme.palette.primary.main,
    marginLeft: 10,
    width: 20,
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing.unit * 8,
  },
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
                <AddSVG className={classes.plusButton} />
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
