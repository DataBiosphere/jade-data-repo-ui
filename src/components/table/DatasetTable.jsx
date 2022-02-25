import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
    features: PropTypes.object,
    filteredDatasetsCount: PropTypes.number,
    handleFilterDatasets: PropTypes.func,
    searchString: PropTypes.string,
    summary: PropTypes.bool,
  };

  render() {
    const {
      classes,
      datasets,
      datasetsCount,
      filteredDatasetsCount,
      features,
      handleFilterDatasets,
      summary,
      searchString,
    } = this.props;
    // TODO add back modified_date column
    const columns = [
      {
        label: 'Dataset Name',
        property: 'name',
        render: (row) => (
          <div>
            <Link to={`/datasets/${row.id}/details`} className={classes.jadeLink}>
              {row.name}
            </Link>
          </div>
        ),
      },
      {
        label: 'Description',
        property: 'description',
      },
      {
        label: 'Date created',
        property: 'created_date',
        render: (row) => moment(row.createdDate).fromNow(),
      },
      {
        label: 'Storage Regions',
        property: 'storage',
        render: (row) => Array.from(new Set(row.storage.map((s) => s.region))).join(', '),
      },
      {
        label: 'Cloud Platform',
        property: 'platform',
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
      />
    );
  }
}

export default withStyles(styles)(DatasetTable);
