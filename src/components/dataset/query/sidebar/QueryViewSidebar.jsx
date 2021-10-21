import React from 'react';
import PropTypes from 'prop-types';
import FilterPanel from './panels/FilterPanel';
import CreateSnapshotPanel from './panels/CreateSnapshotPanel';

export class QueryViewSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSavingSnapshot: false,
    };
  }

  static propTypes = {
    open: PropTypes.bool,
    selected: PropTypes.string,
    switchPanels: PropTypes.func,
    table: PropTypes.object,
    canLink: PropTypes.bool,
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

export default QueryViewSidebar;
