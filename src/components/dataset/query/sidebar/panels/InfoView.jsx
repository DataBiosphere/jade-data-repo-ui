import React from 'react';
import moment from 'moment';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Close, ExpandMore } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import DatasetAccess from './DatasetAccess';

const styles = (theme) => ({
  root: {
    display: 'block',
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
  membershipAccordionContainer: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
  membershipAccordion: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
    color: theme.palette.common.link,
  },
  helpOverlayCloseButton: {
    color: theme.palette.common.link,
  },
});

export class InfoView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHelpVisible: false,
    };
    this.toggleHelpOverlay = this.toggleHelpOverlay.bind(this);
  }

  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    datasetPolicies: PropTypes.array,
  };

  toggleHelpOverlay(helpTitle, helpContent) {
    const { isHelpVisible } = this.state;
    this.setState({
      isHelpVisible: !isHelpVisible,
      helpTitle,
      helpContent,
    });
  }

  render() {
    const { classes, dataset, datasetPolicies } = this.props;
    const { isHelpVisible, helpTitle, helpContent } = this.state;
    return (
      <div className={classes.root}>
        {isHelpVisible && (
          <Grid container spacing={1}>
            <Grid item xs={11}>
              {helpTitle}
            </Grid>
            <Grid item xs={1}>
              <IconButton
                className={classes.helpOverlayCloseButton}
                onClick={this.toggleHelpOverlay}
              >
                <Close />
              </IconButton>
            </Grid>
            <Grid item xs={11}>
              {helpContent}
            </Grid>
          </Grid>
        )}
        {!isHelpVisible && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Dataset Overview</Typography>
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
              {dataset.storage.map((storageResource, i) => (
                <Typography key={i}>
                  {storageResource.cloudResource}: {storageResource.region}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">Date Created:</Typography>
              <Typography>{moment(dataset.createdDate).fromNow()}</Typography>
            </Grid>
            <Grid item xs={12} className={classes.membershipAccordionContainer}>
              <Accordion>
                <AccordionSummary
                  className={clsx(classes.membershipAccordion)}
                  expandIcon={<ExpandMore />}
                  aria-controls="memberships-content"
                  id="memberships-header"
                >
                  Summary of roles and memberships
                </AccordionSummary>
                <AccordionDetails>
                  <DatasetAccess
                    policies={datasetPolicies}
                    helpOverlayToggle={this.toggleHelpOverlay}
                  />
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        )}
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
