import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import _ from 'lodash';

import { getDatasetById } from 'actions/index';
import ManageUsersModal from './ManageUsersModal';
import StudyTable from './table/StudyTable';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing.unit * 4,
    margin: theme.spacing.unit * 4,
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

const hardCodedReaders = [
  'pamela.poovey@figgisagency.com',
  'algernop.krieger@figgisagency.com',
  'cheryl.tunt@figgisagency.com',
  'sterling.archer@figgisagency.com',
  'lana.kane@figgisagency.com',
];

export class DatasetDetailView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    const datasetId = match.params.uuid;
    dispatch(getDatasetById(datasetId));
    // dispatch(getDatasetPolicy(datasetId));
  }

  addUser(datasetId, newEmail) {
    // so need to call something to put them directly in SAM
    console.log('add user');
    console.log(newEmail);
    console.log(datasetId);
    // dispatch(setDatasetPolicy(datasetId, newEmail));
  }

  removeUser(datasetId, removeableEmail) {
    console.log('remove user');
    console.log(removeableEmail);
    console.log(datasetId);
    // TODO send this reader to SAM
    // _.remove(newReaders, r => r === removeableEmail);
    // dispatch(setDatasetPolicy(datasetId, removeableEmail));
  }

  render() {
    const { classes, dataset } = this.props;
    if (!dataset) {
      return (
        <div id="dataset-detail-view" className={classes.wrapper}>
          This dataset does not exist.
        </div>
      );
    }
    const studies = dataset && dataset.source && dataset.source.map(s => s.study);
    const modalText = 'Manage Viewers';
    return (
      <div id="dataset-detail-view" className={classes.wrapper}>
        <div>
          <div className={classes.container}>
            <div>
              <div className={classes.title}>{dataset.name}</div>
              <div>{dataset.description}</div>
            </div>
            <Card className={classes.card}>
              <div className={classes.header}>Custodian: </div>
              <div className={classes.values}> {dataset.owner} </div>
              <div className={classes.header}>Viewers: </div>
              <div className={classes.values}> {dataset.readers} </div>
              <div className={classes.header}> Date Created: </div>
              <div className={classes.values}> {moment(dataset.createdDate).fromNow()} </div>
              <div>
                {dataset && dataset.id && (
                  <ManageUsersModal
                    addUser={_.partial(this.addUser, dataset.id)}
                    removeUser={_.partial(this.removeUser, dataset.id)}
                    modalText={modalText}
                    readers={hardCodedReaders}
                  />
                )}
              </div>
            </Card>
          </div>
          <div>
            <div className={classes.header}>STUDIES IN THIS DATASET</div>
            {/*TODO add front end search once there is more than one study in a dataset*/}
            {dataset && dataset.source && <StudyTable rows={studies} />}
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
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetDetailView));
