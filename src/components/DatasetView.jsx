import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';

import { getDatasets } from 'actions/index';
import DatasetTable from './table/DatasetTable';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1em',
  },
  width: {
    ...theme.mixins.containerWidth,
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
});

class DatasetView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    datasets: PropTypes.array.isRequired,
    datasetsCount: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    features: PropTypes.object,
    filteredDatasetsCount: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    searchString: PropTypes.string,
  };

  handleFilterDatasets = (limit, offset, sort, sortDirection, searchString) => {
    const { dispatch } = this.props;
    dispatch(getDatasets(limit, offset, sort, sortDirection, searchString));
  };

  render() {
    const {
      classes,
      datasets,
      datasetsCount,
      filteredDatasetsCount,
      loading,
      features,
      searchString,
    } = this.props;
    return (
      <div className={classes.wrapper}>
        <div className={classes.width}>
          <div>
            {datasets && (
              <DatasetTable
                datasets={datasets}
                datasetsCount={datasetsCount}
                features={features}
                handleFilterDatasets={this.handleFilterDatasets}
                filteredDatasetsCount={filteredDatasetsCount}
                searchString={searchString}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    datasets: state.datasets.datasets,
    datasetsCount: state.datasets.datasetsCount,
    filteredDatasetsCount: state.datasets.filteredDatasetsCount,
    features: state.user.features,
    loading: state.datasets.loading,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetView));
