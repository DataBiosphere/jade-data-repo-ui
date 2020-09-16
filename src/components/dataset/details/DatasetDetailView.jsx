import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getDatasetById, getDatasetPolicy } from 'actions/index';
import { Typography } from '@material-ui/core';
import DatasetInfoCard from './DatasetInfoCard';
import DatasetRelationshipsPanel from './VisualizeRelationshipsPanel';
import CreateFullSnapshotView from './CreateFullSnapshotView';

const styles = (theme) => ({
  root: {
    // TODO: expect this to change as more components are added
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    margin: '1rem 0.5rem',
  },
  headerText: {
    fontWeight: theme.typography.bold,
    textTransform: 'uppercase',
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
    paddingLeft: '0.5rem',
  },
  mainColumnRow3: {
    flexGrow: 1,
  },
  spacer: {
    height: '4rem',
  },
  pageTitle: {
    margin: '0.5rem',
    fontWeight: theme.typography.bold,
  },
});

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

  useEffect(() => {
    dispatch(getDatasetById(uuid));
    dispatch(getDatasetPolicy(uuid));
  }, []);

  return datasetPolicies && dataset && dataset.id === uuid ? (
    <Fragment>
      <Typography className={classes.pageTitle}>{dataset.name}</Typography>
      <div className={classes.root}>
        <div className={classes.infoColumn}>
          <div className={classes.headerText}>Dataset Schema (default view)</div>
          <div className={classes.infoColumnPanel}>
            <DatasetRelationshipsPanel dataset={dataset} />
          </div>
        </div>
        <div className={classes.mainColumn}>
          <div className={classes.headerText}>Dataset Information</div>
          <DatasetInfoCard openSnapshotCreation={setCreatingSnapshot} />
          <CreateFullSnapshotView
            open={creatingSnapshot}
            openSnapshotCreation={setCreatingSnapshot}
          />
          <div className={classes.mainColumnRow3}>
            <div className={classes.headerText}>Dataset Relationships</div>
          </div>
        </div>
      </div>
    </Fragment>
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

const mapStateToProps = ({ datasets: { dataset, datasetPolicies } }) => ({
  dataset,
  datasetPolicies,
});

export default connect(mapStateToProps)(withStyles(styles)(DatasetDetailView));
