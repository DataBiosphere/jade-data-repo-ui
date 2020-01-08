import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import UserList from '../../../../UserList';

const styles = theme => ({
  root: {
    display: 'block',
    margin: theme.spacing(1),
  },
  paperBody: {
    padding: theme.spacing(1),
  },
  headerText: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
  },
});

export class InfoView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    datasetPolicies: PropTypes.array,
  };

  render() {
    const { classes, dataset, datasetPolicies } = this.props;
    const datasetCustodiansObj = datasetPolicies.find(policy => policy.name === 'custodian');
    const datasetCustodians = (datasetCustodiansObj && datasetCustodiansObj.members) || [];

    return (
      <div className={classes.root}>
        <Paper className={classes.paperBody}>
          <div className={clsx(classes.headerText)}>Date Created: </div>
          <Typography className={classes.cardBody}>
            {moment(dataset.createdDate).fromNow()}
          </Typography>
          <UserList users={datasetCustodians} typeOfUsers="Custodians" canManageUsers={false} />
        </Paper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    datasetPolicies: state.datasets.datasetPolicies,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(InfoView));
