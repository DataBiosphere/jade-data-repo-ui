import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import UserList from '../../../../UserList';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
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
  }
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
    const tables = dataset.schema.tables.map(table => {
      return(<li className={classes.listItem}><Typography noWrap>{table.name}</Typography></li>)
    });

    return (
      <div className={classes.root}>
        <Paper className={classes.paperBody}>
          <Grid container spacing={2}>
            <Grid item xs={12}><Typography variant="h6">{dataset.name}</Typography></Grid>
            <Grid item xs={9}>
              <div className={clsx(classes.headerText)}>About this dataset:
                <Typography>{dataset.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo integer malesuada nunc. Cursus mattis molestie a iaculis. Interdum varius sit amet mattis. Tincidunt eget nullam non nisi. Ipsum dolor sit amet consectetur adipiscing elit ut. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio. Fames ac turpis egestas integer eget aliquet nibh praesent. Non tellus orci ac auctor augue mauris augue neque gravida. Cursus risus at ultrices mi tempus imperdiet. Sit amet nisl purus in mollis nunc. Id eu nisl nunc mi ipsum faucibus vitae aliquet nec. Sed id semper risus in.

</Typography>
              </div>
              <div className={clsx(classes.headerText)}>{dataset.schema.tables.length} tables:
              <ul className={classes.tableList}>{tables}</ul>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className={clsx(classes.headerText)}>Date Created:</div>
              <Typography className={classes.cardBody}>{moment(dataset.createdDate).fromNow()}</Typography>
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
