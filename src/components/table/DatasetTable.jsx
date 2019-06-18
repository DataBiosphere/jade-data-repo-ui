import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { getDatasets } from 'actions/index';
import JadeTable from './JadeTable';

const styles = theme => ({
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
    datasetCount: PropTypes.number,
    datasets: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    summary: PropTypes.bool,
  };

  componentDidMount() {
    const { dispatch, summary } = this.props;
    let limit = 5;
    if (!summary) {
      limit = 10;
    }
    dispatch(getDatasets(limit));
  }

  handleFilterDatasets = (limit, offset, sort, sortDirection, searchString) => {
    const { dispatch } = this.props;
    dispatch(getDatasets(limit, offset, sort, sortDirection, searchString));
  };

  render() {
    const { classes, datasetCount, datasets, summary } = this.props;
    // TODO add back modified_date column
    const columns = [
      {
        label: 'Dataset Name',
        property: 'name',
        render: row => (
          <Link to={`/datasets/details/${row.id}`} className={classes.jadeLink}>
            {row.name}
          </Link>
        ),
      },
      {
        label: 'Description',
        property: 'description',
      },
      {
        label: 'Date created',
        property: 'created_date',
        render: row => moment(row.createdDate).fromNow(),
      },
    ];
    return (
      <div>
        <JadeTable
          columns={columns}
          handleEnumeration={this.handleFilterDatasets}
          itemType="datasets"
          rows={datasets}
          summary={summary}
          totalCount={datasetCount}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    datasets: state.datasets.datasets,
    datasetCount: state.datasets.datasetCount,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetTable));
