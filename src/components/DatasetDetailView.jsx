import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { Link } from 'react-router-dom';

import { getDatasetById } from 'actions/index';
import moment from 'moment';
import JadeTable from './table/JadeTable';

const styles = theme => ({
  wrapper: {
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
    width: '200px',
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
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    const datasetId = match.params.uuid;
    dispatch(getDatasetById(datasetId));
  }

  render() {
    const { classes, dataset } = this.props;
    const studies = dataset.source && dataset.source.map(s => s.study);
    const columns = [
      {
        label: 'Study Name',
        property: 'name',
        render: row => <Link to={`/study/${row.id}`}>{row.name}</Link>,
      },
      {
        label: 'Description',
        property: 'description',
      },
      {
        label: 'Last changed',
        property: 'modifiedDate',
        render: row => moment(row.modifiedDate).fromNow(),
      },
      {
        label: 'Date created',
        property: 'createdDate',
        render: row => moment(row.createdDate).fromNow(),
      },
    ];
    return (
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <div>
            <div className={classes.title}>{dataset.name}</div> {/*TODO add ability to edit name?*/}
            <div>{dataset.description}</div>
          </div>
          <Card className={classes.card}>
            <div className={classes.header}>Principal Investigator: </div>
            {/*TODO where are we even storing this info?*/}
            <div className={classes.values}> {dataset.readers} </div>
            <div className={classes.header}>Custodian(s): </div>
            <div className={classes.values}> {dataset.readers} </div>
            <div className={classes.header}> Date Created: </div>
            <div className={classes.values}> {dataset.createdDate} </div>
            <div className={classes.header}> Last Modified: </div>
            <div className={classes.values}> {dataset.readers} </div>
            {/*TODO hook this up to SAM?!?!?*/}
            <div>Manage Viewers</div>
          </Card>
        </div>
        <div>
          <div className={classes.header}>STUDIES IN THIS DATASET</div>
          {/*TODO add front end search once there is more than one study in a dataset*/}
          {dataset && dataset.source && <JadeTable columns={columns} rows={studies} />}
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
