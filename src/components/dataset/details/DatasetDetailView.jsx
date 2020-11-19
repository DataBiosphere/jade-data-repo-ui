import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getDatasetById, getDatasetPolicy } from 'actions/index';
import { Typography } from '@material-ui/core';
import DatasetInfoCard from './DatasetInfoCard';
import DatasetRelationshipsPanel from './VisualizeRelationshipsPanel';
import CreateFullSnapshotView from './CreateFullSnapshotView';
import { useOnMount } from '../../../libs/utils';
import SnapshotInfoCard from './SnapshotInfoCard';
import NewSnapshotButton from './NewSnapshotButton';

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
    gridTemplateColumns: '1fr 2fr',
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

const fakeSnapshots = [
  {
    name: 'fake-snapshot-1',
    created: '10/10/2020',
    description: 'this is a fake snapshot',
    id: 1,
  },
  {
    name: 'michaels-snapshot',
    created: '03/13/1997',
    description: 'this is michael',
    id: 2,
  },
  {
    name: 'fake-snapshot-1',
    created: '10/10/2020',
    description: 'this is a fake snapshot',
    id: 3,
  },
  {
    name: 'michaels-snapshot',
    created: '03/13/1997',
    description: 'this is michael',
    id: 4,
  },
  {
    name: 'fake-snapshot-1',
    created: '10/10/2020',
    description: 'this is a fake snapshot',
    id: 5,
  },
  {
    name: 'michaels-snapshot',
    created: '03/13/1997',
    description: 'this is michael',
    id: 6,
  },
];

const DatasetDetailView = ({
  classes,
  dataset,
  datasetPolicies,
  dispatch,
  match: {
    params: { uuid },
  },
}) => {
  const [creatingSnapshot, setCreatingSnapshot] = useState(false);

  useOnMount(() => {
    dispatch(getDatasetById(uuid));
    dispatch(getDatasetPolicy(uuid));
  });

  let snapshotCards = [];
  snapshotCards.push(<NewSnapshotButton datasetId={dataset.id} key={dataset.id} />);

  snapshotCards = snapshotCards.concat(
    fakeSnapshots.map((snapshot) => <SnapshotInfoCard snapshot={snapshot} key={snapshot.id} />),
  );

  return datasetPolicies && dataset && dataset.id === uuid ? (
    <div className={classes.pageRoot}>
      <Typography variant="h3" className={classes.pageTitle}>
        {dataset.name}
      </Typography>
      <div className={classes.root}>
        <div className={classes.infoColumn}>
          <Typography variant="h6" className={classes.headerText}>
            Dataset Schema
          </Typography>
          <div className={classes.infoColumnPanel}>
            <DatasetRelationshipsPanel dataset={dataset} />
          </div>
        </div>
        <div className={classes.mainColumn}>
          <Typography variant="h6" className={classes.headerText}>
            Dataset Information
          </Typography>
          <DatasetInfoCard openSnapshotCreation={() => setCreatingSnapshot(true)} />
          <CreateFullSnapshotView
            open={creatingSnapshot}
            onDismiss={() => setCreatingSnapshot(false)}
          />
          <div className={classes.snapshotsArea}>
            <Typography variant="h6" className={classes.headerText}>
              Snapshots
            </Typography>
            <div className={classes.snapshotCardsContainer}>{snapshotCards}</div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
};

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
