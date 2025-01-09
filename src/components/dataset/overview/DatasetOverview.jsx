import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getDatasetById, getDatasetPolicy, getUserDatasetRoles } from 'actions';
import SnapshotPopup from 'components/snapshot/SnapshotPopup';
import DatasetRelationshipsPanel from '../../common/overview/SchemaPanel';
import { useOnMount } from '../../../libs/utils';
import { BreadcrumbType, DatasetIncludeOptions } from '../../../constants';
import LoadingSpinner from '../../common/LoadingSpinner';
import DatasetOverviewPanel from './DatasetOverviewPanel';
import AppBreadcrumbs from '../../AppBreadcrumbs/AppBreadcrumbs';

const Root = styled(Box)(({ theme }) => ({
  ...theme.mixins.pageRoot,
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  ...theme.mixins.pageTitle,
}));

const ContentContainer = styled(Box)({
  height: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 3fr',
  flex: 1,
});

const MainColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 40,
});

const SnapshotGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 32%))',
  gridGap: '1rem',
});

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
    <Root>
      <AppBreadcrumbs
        context={{ type: BreadcrumbType.DATASET, id: datasetId, name: dataset.name }}
        childBreadcrumbs={[]}
      />
      <PageTitle variant="h3">{dataset.name}</PageTitle>
      <ContentContainer>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1 }}>
            <DatasetRelationshipsPanel
              tables={dataset.schema.tables}
              resourceType="Dataset"
              resourceId={dataset.id}
            />
          </Box>
        </Box>
        <MainColumn>
          <DatasetOverviewPanel dataset={dataset} />
        </MainColumn>
      </ContentContainer>
      <SnapshotPopup />
    </Root>
  ) : (
    <Box />
  );
}

DatasetOverview.propTypes = {
  classes: PropTypes.object,
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
