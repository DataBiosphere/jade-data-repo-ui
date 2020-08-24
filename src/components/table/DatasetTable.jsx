import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import moment from 'moment';

import LightTable from './LightTable';

const styles = (theme) => ({
  jadeLink: {
    color: theme.palette.common.link,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

class DatasetTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    datasets: PropTypes.array.isRequired,
    datasetsCount: PropTypes.number,
    features: PropTypes.object,
    handleFilterDatasets: PropTypes.func,
    summary: PropTypes.bool,
  };

  render() {
    const {
      classes,
      datasets,
      datasetsCount,
      features,
      handleFilterDatasets,
      summary,
    } = this.props;
    // TODO add back modified_date column
    const columns = [
      {
        label: 'Dataset Name',
        property: 'name',
        render: (row) => (
          <div>
            {features.granular_sharing && (
              <Link
                to={
                  features.granular_sharing
                    ? `/datasets/${row.id}/details`
                    : `/datasets/${row.id}/query`
                }
                className={classes.jadeLink}
              >
                {row.name}
              </Link>
            )}
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
    ];
    return (
      <LightTable
        columns={columns}
        handleEnumeration={handleFilterDatasets}
        itemType="datasets"
        rows={datasets}
        summary={summary}
        totalCount={datasetsCount}
      />
    );
  }
}

export default withStyles(styles)(DatasetTable);
