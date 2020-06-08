import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import FilterPanel from './panels/FilterPanel';
import { openSnapshotDialog, createSnapshot } from '../../../../actions';
import CreateSnapshotPanel from './panels/CreateSnapshotPanel';
import { push } from 'modules/hist';

export class QueryViewSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSavingSnapshot: false,
    };
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool,
    selected: PropTypes.string,
    switchPanels: PropTypes.func,
    table: PropTypes.object,
  };

  handleCreateSnapshot = (isSavingSnapshot) => {
    this.setState({ isSavingSnapshot });
  };

  handleSaveSnapshot = (assetName) => {
    const { dispatch } = this.props;
    dispatch(createSnapshot(assetName));
    dispatch(openSnapshotDialog(true));
    push('/snapshots');
  };

  render() {
    const { open, table, selected, switchPanels } = this.props;
    const { isSavingSnapshot } = this.state;

    return (
      <div>
        {!isSavingSnapshot ? (
          <FilterPanel
            open={open}
            table={table}
            selected={selected}
            handleCreateSnapshot={this.handleCreateSnapshot}
          />
        ) : (
          <CreateSnapshotPanel
            handleCreateSnapshot={this.handleCreateSnapshot}
            handleSaveSnapshot={this.handleSaveSnapshot}
            handleSelectAsset={this.handleSelectAsset}
            switchPanels={switchPanels}
          />
        )}
      </div>
    );
  }
}

export default QueryViewSidebar;
