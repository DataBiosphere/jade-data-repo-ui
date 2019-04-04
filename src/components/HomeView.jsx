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
    justifyContent: 'center',
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 4,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing.unit * 8,
  },
  card: {
    display: 'inline-block',
    padding: theme.spacing.unit * 4,
    width: '200px',
  },
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
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
        <div>
          <div className={classes.title}>Jade Data Repository at a glance</div>
          <div className={classes.header}>STUDIES</div>
          <div> {studies && studies.studies && <StudyTable rows={studies.studies} />} </div>
          <div className={classes.jadeTableSpacer} />
          <div className={classes.header}>DATASETS</div>
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
