import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getDatasetById, getDatasetPolicy } from 'actions/index';
import DatasetInfoCard from './DatasetInfoCard';

const styles = (theme) => ({
  root: {
    // TODO: expect this to change as more components are added
    padding: theme.spacing(4),
    width: '70%',
    margin: 'auto',
  },
  headerText: {
    fontWeight: theme.typography.bold,
    textTransform: 'uppercase',
    margin: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
  },
});

class DatasetDetailView extends React.PureComponent {
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

  render() {
    const { classes, dataset, datasetPolicies, match } = this.props;
    const { uuid } = match.params;
    if (dataset && datasetPolicies && dataset.id === uuid) {
      return (
        <div className={classes.root}>
          <div className={classes.headerText}>Dataset Information</div>
          <DatasetInfoCard dataset={dataset} datasetPolicies={datasetPolicies} />
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
