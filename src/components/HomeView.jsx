import React from 'react';
import config from 'config';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';

import JadeTable from './table/JadeTable';
import { getDatasets, getStudies } from 'actions/index';

class HomeView extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.object),
    studies: PropTypes.arrayOf(PropTypes.object),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getStudies());
    dispatch(getDatasets());
  }

  render() {
    const { datasets, studies } = this.props;
    const studyColumns = [
      {
        label: 'Study Name',
        property: 'name',
        render: row => <Link to={`/studies/${row.id}`}>{row.name}</Link>,
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
    const datasetColumns = [
      {
        label: 'Dataset ID',
        property: 'id',
        render: row => <Link to={`/datasets/${row.id}`}>{row.id}</Link>,
      },
      {
        label: 'Dataset Name',
        property: 'name',
        render: row => <Link to={`/datasets/${row.id}`}>{row.name}</Link>,
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
      <div>
        <h1>{config.description} at a glance</h1>
        {studies && studies.studies && <JadeTable columns={studyColumns} rows={studies.studies} />}

        {datasets && datasets.datasets && <JadeTable columns={datasetColumns} rows={datasets.datasets} />}

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

export default connect(mapStateToProps)(HomeView);
