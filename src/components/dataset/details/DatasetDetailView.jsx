import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getDatasetById, getDatasetPolicy, getUserDatasetRoles } from 'actions/index';
import { Typography } from '@material-ui/core';
import DatasetRelationshipsPanel from './VisualizeRelationshipsPanel';
import { useOnMount } from '../../../libs/utils';
import { DATASET_INCLUDE_OPTIONS } from '../../../constants';
import DatasetDetailPanel from './DatasetDetailPanel';

const styles = () => ({
  pageRoot: {
    padding: '16px 24px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
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
  pageTitle: {
    marginBottom: '1rem',
  },
  snapshotCardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 32%))',
    gridGap: '1rem',
  },
});

function DatasetDetailView(props) {
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
          <DatasetDetailPanel dataset={dataset} />
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
}

DatasetDetailView.propTypes = {
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

export default connect(mapStateToProps)(withStyles(styles)(DatasetDetailView));
