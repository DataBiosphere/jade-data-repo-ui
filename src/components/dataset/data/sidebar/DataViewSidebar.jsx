import React from 'react';
import PropTypes from 'prop-types';
import FilterPanel from './panels/FilterPanel';
import CreateSnapshotPanel from './panels/CreateSnapshotPanel';

export class DataViewSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSavingSnapshot: false,
    };
  }

  static propTypes = {
    canLink: PropTypes.bool,
    open: PropTypes.bool,
    selected: PropTypes.string,
    switchPanels: PropTypes.func,
    table: PropTypes.object,
  };

  handleCreateSnapshot = (isSavingSnapshot) => {
    this.setState({ isSavingSnapshot });
  };

  render() {
    const { open, table, selected, switchPanels, canLink } = this.props;
    const { isSavingSnapshot } = this.state;

    return (
      <div>
        {!isSavingSnapshot ? (
          <FilterPanel
            canLink={canLink}
            open={open}
            table={table}
            selected={selected}
            handleCreateSnapshot={this.handleCreateSnapshot}
          />
        ) : (
          <CreateSnapshotPanel
            handleCreateSnapshot={this.handleCreateSnapshot}
            switchPanels={switchPanels}
          />
        )}
      </div>
    );
  }
}

export default DataViewSidebar;
