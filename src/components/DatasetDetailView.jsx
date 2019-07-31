import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  getDatasetById,
  getDatasetPolicy,
  addReaderToDataset,
  removeReaderFromDataset,
  addCustodianToDataset,
  removeCustodianFromDataset,
} from 'actions/index';
import DetailViewHeader from './DetailViewHeader';

import StudyTable from './table/StudyTable';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  width: {
    width: '70%',
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
  card: {
    display: 'inline-block',
    padding: theme.spacing(4),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
  },
  info: {
    width: '70%',
  },
  values: {
    paddingBottom: theme.spacing(3),
  },
});

export class DatasetDetailView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dataset: PropTypes.object,
    datasetPolicies: PropTypes.arrayOf(PropTypes.object).isRequired,
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    const datasetId = match.params.uuid;
    dispatch(getDatasetById(datasetId));
    dispatch(getDatasetPolicy(datasetId));
  }

  addReader = newEmail => {
    const { dataset, dispatch } = this.props;
    dispatch(addReaderToDataset(dataset.id, [newEmail]));
  };

  removeReader = removeableEmail => {
    const { dataset, dispatch } = this.props;
    dispatch(removeReaderFromDataset(dataset.id, removeableEmail));
  };

  addCustodian = newEmail => {
    const { dataset, dispatch } = this.props;
    dispatch(addCustodianToDataset(dataset.id, [newEmail]));
  };

  removeCustodian = removeableEmail => {
    const { dataset, dispatch } = this.props;
    dispatch(removeCustodianFromDataset(dataset.id, removeableEmail));
  };

  render() {
    const { classes, dataset, datasetPolicies } = this.props;
    const datasetReadersObj = datasetPolicies.find(policy => policy.name === 'reader'); // TODO make this an enum
    const datasetReaders = (datasetReadersObj && datasetReadersObj.members) || [];
    const datasetCustodiansObj = datasetPolicies.find(policy => policy.name === 'custodian');
    const datasetCustodians = (datasetCustodiansObj && datasetCustodiansObj.members) || [];
    const studies = dataset && dataset.source && dataset.source.map(s => s.study);
    return (
      <div id="dataset-detail-view" className={classes.wrapper}>
        <div className={classes.width}>
          <DetailViewHeader
            of={dataset}
            custodians={datasetCustodians}
            addCustodian={this.addCustodian}
            removeCustodian={this.removeCustodian}
            readers={datasetReaders}
            addReader={this.addReader}
            removeReader={this.removeReader}
          />
          {/* TODO add front end search once there is more than one study in a dataset*/}
          {dataset && dataset.source && (
            <StudyTable rows={studies} studyListName="STUDIES IN THIS DATASET" />
          )}
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    datasetPolicies: state.datasets.datasetPolicies,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetDetailView));
