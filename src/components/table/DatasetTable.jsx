import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { renderCloudPlatforms } from '../../libs/render-utils';

import LightTable from './LightTable';

const styles = (theme) => ({
  jadeLink: {
    ...theme.mixins.jadeLink,
  },
});

class DatasetTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    datasets: PropTypes.array.isRequired,
    datasetsCount: PropTypes.number,
    filteredDatasetsCount: PropTypes.number,
    handleFilterDatasets: PropTypes.func,
    loading: PropTypes.bool.isRequired,
    searchString: PropTypes.string,
  };

  render() {
    const {
      classes,
      datasets,
      datasetsCount,
      filteredDatasetsCount,
      handleFilterDatasets,
      loading,
      searchString,
    } = this.props;
    // TODO add back modified_date column
    const columns = [
      {
        label: 'Dataset Name',
        name: 'name',
        allowSort: true,
        render: (row) => (
          <div>
            <Link to={`/datasets/${row.id}`}>
              <span className={classes.jadeLink}>{row.name}</span>
            </Link>
          </div>
        ),
        width: '25%',
      },
      {
        label: 'Description',
        name: 'description',
        allowSort: true,
        width: '35%',
      },
      {
        label: 'Date created',
        name: 'created_date',
        allowSort: true,
        render: (row) => moment(row.createdDate).fromNow(),
        width: '10%',
      },
      {
        label: 'Storage Regions',
        name: 'storage',
        allowSort: false,
        render: (row) => Array.from(new Set(row.storage.map((s) => s.region))).join(', '),
        width: '15%',
      },
      {
        label: 'Cloud Platform',
        name: 'platform',
        allowSort: false,
        render: renderCloudPlatforms,
        width: '15%',
      },
    ];
    return (
      <LightTable
        columns={columns}
        handleEnumeration={handleFilterDatasets}
        itemType="datasets"
        noRowsMessage={
          filteredDatasetsCount < datasetsCount
            ? 'No datasets match your filter'
            : 'No datasets have been created yet'
        }
        rows={datasets}
        totalCount={datasetsCount}
        filteredCount={filteredDatasetsCount}
        searchString={searchString}
        loading={loading}
      />
    );
  }
}

export default withStyles(styles)(DatasetTable);
