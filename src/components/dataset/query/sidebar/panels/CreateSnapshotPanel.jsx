import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { actions } from 'react-redux-form';
import { connect } from 'react-redux';

import { Button, TextField, Typography } from '@material-ui/core';
import CreateSnapshotDropdown from '../CreateSnapshotDropdown';
import ShareSnapshot from './ShareSnapshot';
import { snapshotCreateDetails } from 'actions/index';

const styles = (theme) => ({
  root: {
    margin: theme.spacing(1),
    display: 'grid',
    gridTemplateRows: 'calc(100vh - 125px) 100px',
  },
  rowOne: {
    gridRowStart: 1,
    gridRowEnd: 2,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: theme.spacing(1),
  },
  rowTwo: {
    gridRowStart: 2,
    gridRowEnd: 3,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(1),
  },
  textField: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
  },
});

export class CreateSnapshotPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    const { name, description, assetName } = this.props.snapshots.snapshotRequest;
    this.state = {
      name,
      description,
      assetName,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    filterData: PropTypes.object,
    handleCreateSnapshot: PropTypes.func,
    handleSaveSnapshot: PropTypes.func,
    handleSelectAsset: PropTypes.func,
    snapshot: PropTypes.object,
    switchPanels: PropTypes.func,
  };

  saveNameAndDescription = () => {
    const { dispatch, switchPanels, filterData, dataset } = this.props;
    const { name, description, assetName } = this.state;
    dispatch(snapshotCreateDetails(name, description, assetName, filterData, dataset));
    switchPanels(ShareSnapshot);
  };

  handleSelectAsset = (event) => {
    const assetName = event.target.value;
    this.setState({
      assetName,
    });
  };

  render() {
    const { classes, dataset, handleCreateSnapshot } = this.props;
    const { name, description, assetName } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.rowOne}>
          <Typography variant="h6">Add Details</Typography>
          <Typography variant="subtitle2">Snapshot Name</Typography>
          <TextField
            id="snapshotName"
            variant="outlined"
            size="small"
            fullWidth
            className={classes.textField}
            onChange={(event) => this.setState({ name: event.target.value })}
            value={name}
            data-cy="textFieldName"
          />
          <Typography variant="subtitle2">Description</Typography>
          <TextField
            id="snapshotDescription"
            variant="outlined"
            size="small"
            multiline
            rows={10}
            fullWidth
            className={classes.textField}
            onChange={(event) => this.setState({ description: event.target.value })}
            value={description}
          />
          {/* TODO: decide what to do when there's only one asset */}
          <CreateSnapshotDropdown
            options={dataset.schema.assets}
            onSelectedItem={this.handleSelectAsset}
            value={assetName}
            data-cy="selectAsset"
          />
        </div>
        <div className={classes.rowTwo}>
          <div className={classes.buttonContainer}>
            <Button onClick={() => handleCreateSnapshot(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={this.saveNameAndDescription}
              disabled={assetName === '' || name === ''}
              data-cy="next"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    snapshots: state.snapshots,
    dataset: state.datasets.dataset,
    filterData: state.query.filterData,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(CreateSnapshotPanel));
