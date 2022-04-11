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
    summary: PropTypes.bool,
  };

  render() {
    const {
      classes,
      datasets,
      datasetsCount,
      filteredDatasetsCount,
      handleFilterDatasets,
      loading,
      summary,
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
      },
      {
        label: 'Description',
        name: 'description',
        allowSort: true,
      },
      {
        label: 'Date created',
        name: 'created_date',
        allowSort: true,
        render: (row) => moment(row.createdDate).fromNow(),
      },
      {
        label: 'Storage Regions',
        name: 'storage',
        allowSort: false,
        render: (row) => Array.from(new Set(row.storage.map((s) => s.region))).join(', '),
      },
      {
        label: 'Cloud Platform',
        name: 'platform',
        allowSort: false,
        render: renderCloudPlatforms,
      },
    ];
    return (
      <LightTable
        columns={columns}
        handleEnumeration={handleFilterDatasets}
        itemType="datasets"
        rows={datasets}
        summary={summary}
        totalCount={datasetsCount}
        filteredCount={filteredDatasetsCount}
        searchString={searchString}
        loading={loading}
      />
    );
  }
}

export default withStyles(styles)(DatasetTable);
