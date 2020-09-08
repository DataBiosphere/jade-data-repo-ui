import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getDatasetById, getDatasetPolicy } from 'actions/index';
import { Grid, Typography } from '@material-ui/core';
import DatasetInfoCard from './DatasetInfoCard';
import CreateFullSnapshotView from './CreateFullSnapshotView';
import DatasetRelationshipsPanel from './DatasetRelationshipsPanel';

const styles = (theme) => ({
  root: {
    // TODO: expect this to change as more components are added
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
  },
  headerText: {
    fontWeight: theme.typography.bold,
    textTransform: 'uppercase',
  },
  infoColumn: {
    margin: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    display: 'grid',
    gridColumnStart: 1,
    gridColumnEnd: 2,
    gridTemplateRows: '1fr 5fr',
  },
  mainColumn: {
    gridColumnStart: 2,
    gridColumnEnd: 3,
  },
  infoColumnRow1: {
    gridRowStart: 1,
    gridRowEnd: 2,
  },
  infoColumnRow2: {
    gridRowStart: 2,
    gridRowEnd: 3,
  }
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
    <div className={classes.root}>
      <div className={classes.infoColumn}>
        <div className={classes.infoColumnRow1}>
          <h2>{dataset.name}</h2>
          <div className={classes.headerText}>Dataset Schema (default view)</div>
        </div>
        <div className={classes.infoColumnRow2}>
          <DatasetRelationshipsPanel dataset={dataset} />
        </div>
      </div>
      <div className={classes.mainColumn}>
        <DatasetInfoCard dataset={dataset} datasetPolicies={datasetPolicies} />
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

const mapStateToProps = ({ datasets: { dataset, datasetPolicies } }) => ({
  dataset,
  datasetPolicies,
});

export default connect(mapStateToProps)(withStyles(styles)(DatasetDetailView));
