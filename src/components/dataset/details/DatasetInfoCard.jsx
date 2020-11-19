import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Launch } from '@material-ui/icons';
import { connect } from 'react-redux';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  headerText: {
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1rem 0',
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
      <Paper className={classes.root} elevation={4}>
        <Typography variant="h3">{dataset.name}</Typography>
        <div className={classes.flex}>
          <div style={{ flex: 2 }}>
            <Typography variant="h6" className={classes.headerText}>
              Description:
            </Typography>
            <Typography>{dataset.description}</Typography>
          </div>
          <div style={{ flex: 1, paddingLeft: '1rem', paddingRight: '1rem' }}>
            <Typography variant="h6" className={classes.headerText}>
              Custodians:
            </Typography>
            {datasetCustodians.map((custodian, i) => (
              <Typography key={i}>{custodian}</Typography>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <Typography variant="h6" className={classes.headerText}>
              Date Created:
            </Typography>
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

const mapStateToProps = ({ datasets: { dataset, datasetPolicies } }) => ({
  dataset,
  datasetPolicies,
});

export default connect(mapStateToProps)(withStyles(styles)(DatasetInfoCard));
