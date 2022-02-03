import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Close, ExpandMore, Launch } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import DatasetAccess from './DatasetAccess';
import TerraTooltip from '../../../../common/TerraTooltip';

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
  tableList: {
    listStyle: 'none',
    padding: '0px',
    margin: '0px',
  },
  listItem: {
    backgroundColor: theme.palette.primary.lightContrast,
    margin: '6px 0px 6px 0px',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    '& a': {
      display: 'flex',
      flex: 1,
    },
    '& a p': {
      flex: 1,
      padding: '3px 3px 3px 5px',
    },
    '& a svg': {
      marginRight: '3px',
      marginTop: '3px',
    },
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
      isAccordionExpanded: false,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    user: PropTypes.object,
  };

  toggleHelpOverlay = (helpTitle, helpContent) => {
    const { isHelpVisible } = this.state;
    this.setState({
      isHelpVisible: !isHelpVisible,
      helpTitle,
      helpContent,
    });
  };

  toggleAccordion = () => {
    const { isAccordionExpanded } = this.state;
    this.setState({
      isAccordionExpanded: !isAccordionExpanded,
    });
  };

  render() {
    const { classes, dataset, user } = this.props;
    const { isAccordionExpanded, isHelpVisible, helpTitle, helpContent } = this.state;

    const linkToBq = dataset.accessInformation?.bigQuery !== undefined;
    const tables = dataset.schema.tables.map((table, i) => (
      <li key={`${i}`} className={classes.listItem}>
        {linkToBq && (
          <TerraTooltip
            title={`Click to navigate to the Google BigQuery console where you can perform more advanced queries against the ${table.name} dataset table`}
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${
                _.find(dataset.accessInformation.bigQuery.tables, (t) => t.name === table.name)
                  ?.link
              }&authuser=${user.email}`}
            >
              <Typography title={table.name} noWrap>
                {table.name}
              </Typography>
              <Launch />
            </a>
          </TerraTooltip>
        )}
        {!linkToBq && (
          <Typography title={table.name} noWrap>
            {table.name}
          </Typography>
        )}
      </li>
    ));

    const consoleLink = linkToBq
      ? `${dataset.accessInformation.bigQuery.link}&authuser=${user.email}`
      : '';

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
              <Typography variant="h5">{dataset.name}</Typography>
            </Grid>
            {linkToBq && (
              <Grid item xs={12}>
                <TerraTooltip title="Click to navigate to the Google BigQuery console where you can perform more advanced queries against your dataset tables">
                  <Button color="primary" variant="contained" endIcon={<Launch />}>
                    <a target="_blank" rel="noopener noreferrer" href={consoleLink}>
                      View in Google Console
                    </a>
                  </Button>
                </TerraTooltip>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="h6">About this dataset</Typography>
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
              <Accordion expanded={isAccordionExpanded} onChange={this.toggleAccordion}>
                <AccordionSummary
                  className={clsx(classes.membershipAccordion)}
                  expandIcon={<ExpandMore />}
                  aria-controls="memberships-content"
                  id="memberships-header"
                >
                  Summary of roles and memberships
                </AccordionSummary>
                <AccordionDetails>
                  <DatasetAccess helpOverlayToggle={this.toggleHelpOverlay} />
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Tables</Typography>
              <ul className={classes.tableList}>{tables}</ul>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    dataset: state.datasets.dataset,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(InfoView));
