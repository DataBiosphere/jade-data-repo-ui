import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import {
  getDatasetById,
  getDatasetPolicy,
  addCustodianToDataset,
  removeCustodianFromDataset,
} from 'actions/index';
import DetailViewHeader from './DetailViewHeader';
import DatasetTablePreview from './DatasetTablePreview';

const styles = (theme) => ({
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
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
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
    match: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const datasetId = match.params.uuid;
    // TODO: is this useful to have these separated?
    dispatch(getDatasetById(datasetId));
    dispatch(getDatasetPolicy(datasetId));
  }

  addUser = (newEmail) => {
    const { dispatch, dataset } = this.props;
    dispatch(addCustodianToDataset(dataset.id, [newEmail]));
  };

  removeUser = (removeableEmail) => {
    const { dispatch, dataset } = this.props;
    dispatch(removeCustodianFromDataset(dataset.id, removeableEmail));
  };

  render() {
    const { classes, dataset, datasetPolicies } = this.props;
    const datasetCustodiansObj = datasetPolicies.find((policy) => policy.name === 'custodian');
    const datasetCustodians = (datasetCustodiansObj && datasetCustodiansObj.members) || [];
    return (
      <div className={classes.wrapper}>
        <div className={classes.width}>
          <DetailViewHeader
            of={dataset}
            custodians={datasetCustodians}
            addCustodian={this.addUser}
            removeCustodian={this.removeUser}
          />
          <Link to={`/datasets/details/${dataset.id}/query`}>
            <Button data-cy="queryDatasetButton"> query dataset</Button>
          </Link>
          {dataset && dataset.schema && <DatasetTablePreview dataset={dataset} />}
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
