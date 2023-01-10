import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { WithStyles, withStyles } from '@mui/styles';
import { Property } from 'csstype';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  CircularProgress,
  CustomTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { TdrState } from 'reducers';
import { DatasetModel } from 'generated/tdr';

const styles = (theme: CustomTheme) => ({
  name: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: '4px 4px 0px 0px',
  },
  content: {
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  actions: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
    textAlign: 'center' as Property.TextAlign,
  },
  centered: {
    textAlign: 'center' as Property.TextAlign,
  },
  jadeLink: {
    ...theme.mixins.jadeLink,
  },
});

interface IProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  dataset?: DatasetModel;
  creationIsProcessing: boolean;
}

const DatasetCreationModal = withStyles(styles)(
  ({ classes, isOpen, dataset, creationIsProcessing }: IProps) => {
    if (creationIsProcessing) {
      return (
        <Dialog open={isOpen}>
          <DialogTitle>Your dataset is being created</DialogTitle>
          <DialogContent>
            <div className={clsx(classes.centered, classes.content)}>
              <div>This operation usually takes a minute or so. Please do not click away.</div>
            </div>
            <div className={clsx(classes.centered, classes.content)}>
              <CircularProgress />
            </div>
          </DialogContent>
        </Dialog>
      );
    }
    if (dataset) {
      return (
        <Dialog open={isOpen}>
          <DialogTitle>Your dataset was successfully created!</DialogTitle>
          <DialogContent>
            <div className={classes.actions}>
              <Button
                // className={classes.jadeLink}
                color="primary"
                variant="contained"
                aria-label="Go to created dataset details"
                disableElevation
              >
                <Link to={`/datasets/${dataset.id}`}>Go to Dataset Details Page</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
    return <div />;
  },
);

function mapStateToProps(state: TdrState) {
  return {
    isOpen: state.datasets.dialogIsOpen,
    dataset: state.datasets.dataset,
    creationIsProcessing: state.datasets.creationIsProcessing,
  };
}

export default connect(mapStateToProps)(DatasetCreationModal);
