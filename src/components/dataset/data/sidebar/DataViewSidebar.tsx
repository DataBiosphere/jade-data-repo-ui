import React, { useState } from 'react';
import { TableModel } from 'generated/tdr';
import FilterPanel from './panels/FilterPanel';
import CreateSnapshotPanel from './panels/CreateSnapshotPanel';

type DataViewSidebarProps = {
  canLink: boolean;
  open: boolean;
  selected: string;
  switchPanels: () => void;
  table: TableModel;
};

function DataViewSidebar({ canLink, open, selected, switchPanels, table }: DataViewSidebarProps) {
  const [isSavingSnapshot, setIsSavingSnapshot] = useState(false);

  const handleCreateSnapshot = (savingSnapshot: boolean) => {
    setIsSavingSnapshot(savingSnapshot);
  };

  return (
    <div>
      {!isSavingSnapshot ? (
        <FilterPanel
          canLink={canLink}
          open={open}
          table={table}
          selected={selected}
          handleCreateSnapshot={handleCreateSnapshot}
        />
      ) : (
        <CreateSnapshotPanel
          handleCreateSnapshot={handleCreateSnapshot}
          switchPanels={switchPanels}
        />
      )}
    </div>
  );
}

export default DataViewSidebar;
