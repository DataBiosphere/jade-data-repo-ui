import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getDatasetById, getDatasetPolicy, getUserDatasetRoles } from 'actions';
import { Typography } from '@material-ui/core';
import DatasetRelationshipsPanel from './DatasetOverviewSchemaPanel';
import { useOnMount } from '../../../libs/utils';
import { BREADCRUMB_TYPE, DATASET_INCLUDE_OPTIONS } from '../../../constants';
import DatasetOverviewPanel from './DatasetOverviewPanel';
import AppBreadcrumbs from '../../AppBreadcrumbs/AppBreadcrumbs';

const styles = (theme) => ({
  pageRoot: { ...theme.mixins.pageRoot },
  pageTitle: { ...theme.mixins.pageTitle },
  root: {
    // TODO: expect this to change as more components are added
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    flex: 1,
  },
  headerText: {
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoColumnPanel: {
    flexGrow: 1,
  },
  mainColumn: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 40,
  },
  snapshotsArea: {
    flexGrow: 1,
    marginTop: '1.5rem',
  },
  spacer: {
    height: '4rem',
  },
  snapshotCardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 32%))',
    gridGap: '1rem',
  },
});

function DatasetOverview(props) {
  const { classes, dataset, datasetPolicies, dispatch, match } = props;
  const datasetId = match.params.uuid;
  useOnMount(() => {
    dispatch(
      getDatasetById({
        datasetId,
        include: [
          DATASET_INCLUDE_OPTIONS.SCHEMA,
          DATASET_INCLUDE_OPTIONS.ACCESS_INFORMATION,
          DATASET_INCLUDE_OPTIONS.PROFILE,
          DATASET_INCLUDE_OPTIONS.DATA_PROJECT,
          DATASET_INCLUDE_OPTIONS.STORAGE,
        ],
      }),
    );
    dispatch(getDatasetPolicy(datasetId));
    dispatch(getUserDatasetRoles(datasetId));
  });

  return datasetPolicies && dataset && dataset.id === datasetId ? (
    <div className={classes.pageRoot}>
      <AppBreadcrumbs
        context={{ type: BREADCRUMB_TYPE.DATASET, id: datasetId, name: dataset.name }}
      />
      <Typography variant="h3" className={classes.pageTitle}>
        {dataset.name}
      </Typography>
      <div className={classes.root}>
        <div className={classes.infoColumn}>
          <div className={classes.infoColumnPanel}>
            <DatasetRelationshipsPanel dataset={dataset} />
          </div>
        </div>
        <div className={classes.mainColumn}>
          <DatasetOverviewPanel dataset={dataset} />
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
}

DatasetOverview.propTypes = {
  classes: PropTypes.object,
  dataset: PropTypes.object,
  datasetPolicies: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
};

const mapStateToProps = ({ datasets: { dataset, datasetPolicies }, dispatch }) => ({
  dataset,
  datasetPolicies,
  dispatch,
});

export default connect(mapStateToProps)(withStyles(styles)(DatasetOverview));
