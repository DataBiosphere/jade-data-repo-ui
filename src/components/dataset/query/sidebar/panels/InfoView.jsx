import React from 'react';
import moment from 'moment';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { ExpandMore } from '@material-ui/icons';
import DatasetAccess from './DatasetAccess';

const styles = (theme) => ({
  root: {
    display: 'block',
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
  blueHeader: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
    color: theme.palette.common.link,
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

    return (
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Dataset Overview</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">{dataset.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">About this dataset:</Typography>
            <Typography>{dataset.description}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Storage</Typography>
            <Typography>
              {dataset.storage.map((storageResource) => (
                <div>
                  {storageResource.cloudResource}: {storageResource.region}
                </div>
              ))}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Date Created:</Typography>
            <Typography>{moment(dataset.createdDate).fromNow()}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                className={clsx(classes.blueHeader)}
                expandIcon={<ExpandMore />}
                aria-controls="memberships-content"
                id="memberships-header"
              >
                Summary of roles and memberships
              </AccordionSummary>
              <AccordionDetails>
                <DatasetAccess policies={datasetPolicies} />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
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
