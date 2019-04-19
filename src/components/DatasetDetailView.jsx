import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import _ from 'lodash';

import {
  getDatasetById,
  getDatasetPolicy,
  setDatasetPolicy,
  removeReaderFromDataset,
} from 'actions/index';
import ManageUsersModal from './ManageUsersModal';
import StudyTable from './table/StudyTable';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 4,
  },
  width: {
    width: '70%',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing.unit * 8,
  },
  card: {
    display: 'inline-block',
    padding: theme.spacing.unit * 4,
  },
  header: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
  },
  values: {
    paddingBottom: theme.spacing.unit * 3,
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

  addUser(dispatch, datasetId, newEmail) {
    // for now the setDatasetPolicy method will trigger a reset of datasetReaders
    dispatch(setDatasetPolicy(datasetId, [newEmail]));
  }

  removeUser(dispatch, datasetId, removeableEmail) {
    dispatch(removeReaderFromDataset(datasetId, removeableEmail));
  }

  render() {
    const { classes, dataset, datasetPolicies, dispatch } = this.props;
    const datasetReadersObj = datasetPolicies.find(policy => policy.name === 'reader'); // TODO make this an enum
    const datasetReaders = (datasetReadersObj && datasetReadersObj.members) || [];
    const datasetCustodiansObj = datasetPolicies.find(policy => policy.name === 'custodian');
    const datasetCustodians = (datasetCustodiansObj && datasetCustodiansObj.members) || [];
    const modalText = 'Viewers';
    // TODO should there be placeholders in the UI if there are no readers? Or should that section of the container just not show?
    if (!dataset) {
      return (
        <div id="dataset-detail-view" className={classes.wrapper}>
          This dataset does not exist.
        </div>
      );
    }
    const studies = dataset && dataset.source && dataset.source.map(s => s.study);
    return (
      <div id="dataset-detail-view" className={classes.wrapper}>
        <div className={classes.width}>
          <div className={classes.container}>
            <div>
              <div className={classes.title}>{dataset.name}</div>
              <div>{dataset.description}</div>
            </div>
            <Card className={classes.card}>
              <div className={classes.header}>Custodian: </div>
              {datasetCustodians.map(custodian => (
                <div className={classes.values} id={custodian}>
                  {custodian}
                </div>
              ))}
              {datasetReaders.length > 0 ? (
                <div>
                  <div className={classes.header}>{modalText}: </div>
                  <div className={classes.values}>
                    {datasetReaders.map(reader => (
                      <div id={reader}>{reader}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div />
              )}
              <div className={classes.header}> Date Created: </div>
              <div className={classes.values}> {moment(dataset.createdDate).fromNow()} </div>
              <div>
                {dataset && dataset.id && (
                  <ManageUsersModal
                    addUser={_.partial(this.addUser, dispatch, dataset.id)}
                    dispatch={dispatch}
                    removeUser={_.partial(this.removeUser, dispatch, dataset.id)}
                    modalText={`Manage ${modalText}`}
                    readers={datasetReaders}
                  />
                )}
              </div>
            </Card>
          </div>
          <div>
            {/*TODO add front end search once there is more than one study in a dataset*/}
            {dataset && dataset.source && (
              <StudyTable rows={studies} studyListName="STUDIES IN THIS DATASET" />
            )}
          </div>
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
