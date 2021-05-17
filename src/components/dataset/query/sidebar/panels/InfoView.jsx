import React from 'react';
import moment from 'moment';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import UserList from '../../../../UserList';

const styles = (theme) => ({
  root: {
    display: 'block',
    margin: theme.spacing(1),
  },
  paperBody: {
    padding: theme.spacing(2),
  },
  headerText: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
    marginTop: theme.spacing(3),
  },
  tableList: {
    listStyle: 'none',
    padding: '0px',
    width: '50%',
    margin: '0px',
  },
  listItem: {
    backgroundColor: theme.palette.primary.lightContrast,
    margin: '6px 0px 6px 0px',
    borderRadius: '3px',
    padding: '3px 3px 3px 5px',
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
    const datasetCustodiansObj = datasetPolicies.find((policy) => policy.name === 'custodian');
    const datasetCustodians = (datasetCustodiansObj && datasetCustodiansObj.members) || [];
    const tables = dataset.schema.tables.map((table) => (
      <li className={classes.listItem}>
        <Typography noWrap>{table.name}</Typography>
      </li>
    ));

    return (
      <div className={classes.root}>
        <Paper className={classes.paperBody}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">{dataset.name}</Typography>
            </Grid>
            <Grid item xs={9}>
              <div className={clsx(classes.headerText)}>
                About this dataset:
                <Typography>{dataset.description}</Typography>
              </div>
              <div className={clsx(classes.headerText)}>
                {dataset.schema.tables.length} tables:
                <ul className={classes.tableList}>{tables}</ul>
              </div>
              <div className={clsx(classes.headerText)}>
                Storage:
                <Typography>
                  <ul>
                    {dataset.storage.map((storageResource) => (
                      <li>
                        {storageResource.cloudResource}: {storageResource.region}
                      </li>
                    ))}
                  </ul>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className={clsx(classes.headerText)}>Date Created:</div>
              <Typography className={classes.cardBody}>
                {moment(dataset.createdDate).fromNow()}
              </Typography>
              <UserList users={datasetCustodians} typeOfUsers="Custodians" canManageUsers={false} />
            </Grid>
          </Grid>
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
