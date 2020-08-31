import React from 'react';
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
    margin: theme.spacing(3),
    height: '100%',
  },
  headerText: {
    fontWeight: theme.typography.bold,
    textTransform: 'uppercase',
    margin: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
  },
});

class DatasetDetailView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      creatingSnapshot: false,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    datasetPolicies: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object,
  };

  componentDidMount() {
    const { match, dispatch } = this.props;
    const { uuid } = match.params;
    dispatch(getDatasetById(uuid));
    dispatch(getDatasetPolicy(uuid));
  }

  openSnapshotCreation = (isOpen) => {
    this.setState({ creatingSnapshot: isOpen });
  };

  render() {
    const { classes, dataset, datasetPolicies, match } = this.props;
    const { creatingSnapshot } = this.state;
    const { uuid } = match.params;
    if (dataset && datasetPolicies && dataset.id === uuid) {
      return (
        <div className={classes.root}>
          <Grid container>
            <Grid xs={12}>
              <div className={classes.headerText}>
                <h2>{dataset.name}</h2>
              </div>
            </Grid>
            <Grid container xs={12}>
              <Grid xs={4}>
                <div className={classes.headerText}>Dataset Schema (default view)</div>
                <DatasetRelationshipsPanel dataset={dataset} />
              </Grid>
              <Grid xs={8}>
                <div className={classes.headerText}>Dataset Information</div>
                <DatasetInfoCard
                  dataset={dataset}
                  datasetPolicies={datasetPolicies}
                  openSnapshotCreation={this.openSnapshotCreation}
                />
                <CreateFullSnapshotView
                  open={creatingSnapshot}
                  openSnapshotCreation={this.openSnapshotCreation}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      );
    }
    return <div />; // TODO: Make this a loading spinner
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    datasetPolicies: state.datasets.datasetPolicies,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetDetailView));
