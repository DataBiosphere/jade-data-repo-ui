import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { getDatasets, getStudies } from 'actions/index';
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
    datasets: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    studies: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getStudies());
    dispatch(getDatasets());
  }

  render() {
    const { classes, datasets, studies } = this.props;
    return (
      <div className={classes.wrapper}>
        <div className={classes.width}>
          <div className={classes.title}>Terra Data Repository at a glance</div>
          <div> {studies && studies.studies && <StudyTable rows={studies.studies} />} </div>
          <div className={classes.jadeTableSpacer} />
          <div> {datasets && datasets.datasets && <DatasetTable rows={datasets.datasets} />} </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    datasets: state.datasets,
    studies: state.studies,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(HomeView));
