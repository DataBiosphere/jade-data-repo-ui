import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Launch } from '@material-ui/icons';

const styles = (theme) => ({
  root: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
  headerText: {
    fontWeight: theme.typography.bold,
    textTransform: 'uppercase',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: `${theme.spacing(2)}px 0px`,
  },
  jadeLink: {
    color: theme.palette.common.link,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    alignItems: 'center',
    display: 'flex',
  },
  button: {
    color: theme.palette.common.link,
    border: `1px solid ${theme.palette.common.link}`,
  },
});

export class DatasetInfoCard extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    datasetPolicies: PropTypes.array,
    openSnapshotCreation: PropTypes.func,
  };

  render() {
    const { classes, dataset, datasetPolicies, openSnapshotCreation } = this.props;
    const datasetCustodiansObj = datasetPolicies.find((policy) => policy.name === 'custodian');
    const datasetCustodians = (datasetCustodiansObj && datasetCustodiansObj.members) || [];
    const bigQueryUrl = `https://console.cloud.google.com/bigquery?project=${dataset.dataProject}&supportedpurview=project&p=${dataset.dataProject}&d=datarepo_${dataset.name}&page=dataset`;

    return (
      <Paper className={classes.root}>
        <Typography variant="h6">{dataset.name}</Typography>
        <div className={classes.flex}>
          <div>
            <div className={classes.headerText}>Description:</div>
            <Typography>{dataset.description}</Typography>
          </div>
          <div>
            <div className={classes.headerText}>Custodians:</div>
            {datasetCustodians.map((custodian, i) => (
              <Typography key={i}>{custodian}</Typography>
            ))}
          </div>
          <div>
            <div className={classes.headerText}>Date Created:</div>
            <Typography>{new Date(dataset.createdDate).toLocaleDateString()}</Typography>
          </div>
        </div>
        <div className={classes.flex}>
          <div className={classes.jadeLink}>
            <a
              href={bigQueryUrl}
              // rel=noopener mitigates security risk here
              // eslint-disable-next-line
              target="_blank"
              rel="noopener"
            >
              View in SQL Viewer
            </a>
            <Launch fontSize="small" />
          </div>
          <Button
            className={classes.button}
            variant="outlined"
            onClick={() => openSnapshotCreation(true)}
          >
            Snapshot full dataset
          </Button>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(DatasetInfoCard);
