import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import { getDatasets, getStudies } from 'actions/index';
import JadeTable from './table/JadeTable';
import DatasetTable from './table/DatasetTable';

const styles = theme => ({
  wrapper: {
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
    const studyColumns = [
      {
        label: 'Study Name',
        property: 'name',
        render: row => <Link to={`/study/${row.id}`}>{row.name}</Link>,
      },
      {
        label: 'Description',
        property: 'description',
      },
      {
        label: 'Last changed',
        property: 'modifiedDate',
        render: row => moment(row.modifiedDate).fromNow(),
      },
      {
        label: 'Date created',
        property: 'createdDate',
        render: row => moment(row.createdDate).fromNow(),
      },
    ];
    return (
      <div className={classes.wrapper}>
        <div className={classes.title}>Jade Data Repository at a glance</div>
        <div className={classes.header}>STUDIES</div>
        {studies && studies.studies && <JadeTable columns={studyColumns} rows={studies.studies} />}
        <div className={classes.jadeTableSpacer} />
        <div className={classes.header}>DATASETS</div>
        <div> {datasets && datasets.datasets && <DatasetTable rows={datasets.datasets} />} </div>
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
