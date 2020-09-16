import _ from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getDatasetById, getDatasetPolicy } from 'actions/index';
import { Grid, Typography } from '@material-ui/core';
import DatasetInfoCard from './DatasetInfoCard';
import CreateFullSnapshotView from './CreateFullSnapshotView';
import DatasetRelationshipsPanel from './VisualizeRelationshipsPanel';

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
  mainColumnRow1: {},
  mainColumnRow2: {},
  mainColumnRow3: {
    flexGrow: 1,
  },
  spacer: {
    height: 64,
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
      <h2 style={{ margin: '0.5rem' }}>{dataset.name}</h2>
      <div className={classes.root}>
        <div className={classes.infoColumn}>
          <div className={classes.headerText}>Dataset Schema (default view)</div>
          <div className={classes.infoColumnPanel}>
            <DatasetRelationshipsPanel dataset={dataset} />
          </div>
        </div>
        <div className={classes.mainColumn}>
          <div className={classes.mainColumnRow1}>
            <div className={classes.datasetInfoContainer}>
              <div className={classes.headerText}>Dataset Information</div>
            </div>
          </div>
          <div className={classes.mainColumnRow2}>
            <DatasetInfoCard dataset={dataset} datasetPolicies={datasetPolicies} />
          </div>
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
