import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { getDatasetById, getDatasetPolicy, getUserDatasetRoles } from 'actions';
import SnapshotPopup from 'components/snapshot/SnapshotPopup';
import theme from 'modules/theme';
import DatasetRelationshipsPanel from '../../common/overview/SchemaPanel';
import { useOnMount } from '../../../libs/utils';
import { BreadcrumbType, DatasetIncludeOptions } from '../../../constants';
import LoadingSpinner from '../../common/LoadingSpinner';
import DatasetOverviewPanel from './DatasetOverviewPanel';
import AppBreadcrumbs from '../../AppBreadcrumbs/AppBreadcrumbs';

function DatasetOverview(props) {
  const { dataset, datasetPolicies, datasetByIdLoading, dispatch, match } = props;
  const datasetId = match.params.uuid;
  useOnMount(() => {
    dispatch(
      getDatasetById({
        datasetId,
        include: [
          DatasetIncludeOptions.SCHEMA,
          DatasetIncludeOptions.ACCESS_INFORMATION,
          DatasetIncludeOptions.PROFILE,
          DatasetIncludeOptions.DATA_PROJECT,
          DatasetIncludeOptions.STORAGE,
        ],
      }),
    );
    dispatch(getDatasetPolicy(datasetId));
    dispatch(getUserDatasetRoles(datasetId));
  });

  if (datasetByIdLoading) {
    return <LoadingSpinner />;
  }
  return datasetPolicies && dataset && dataset.schema && dataset.id === datasetId ? (
    <Box sx={{ ...theme.mixins.pageRoot }}>
      <AppBreadcrumbs
        context={{ type: BreadcrumbType.DATASET, id: datasetId, name: dataset.name }}
        childBreadcrumbs={[]}
      />
      <Typography variant="h3" sx={{ ...theme.mixins.pageTitle }}>
        {dataset.name}
      </Typography>
      <Box sx={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 3fr', flex: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1 }}>
            <DatasetRelationshipsPanel
              tables={dataset.schema.tables}
              resourceType="Dataset"
              resourceId={dataset.id}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '40px' }}>
          <DatasetOverviewPanel dataset={dataset} />
        </Box>
      </Box>
      <SnapshotPopup />
    </Box>
  ) : (
    <Box />
  );
}

DatasetOverview.propTypes = {
  dataset: PropTypes.object,
  datasetByIdLoading: PropTypes.bool,
  datasetPolicies: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
};

const mapStateToProps = ({
  datasets: { dataset, datasetPolicies, datasetByIdLoading },
  dispatch,
}) => ({
  dataset,
  datasetPolicies,
  datasetByIdLoading,
  dispatch,
});

export default connect(mapStateToProps)(DatasetOverview);
