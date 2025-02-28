import React from 'react';
import { connect } from 'react-redux';
import { TdrState } from 'reducers';
import { SnapshotWorkspaceEntry } from 'models/workspaceentry';
import { List, ListSubheader, Typography } from '@mui/material';
import { InaccessibleWorkspacePolicyModel, WorkspacePolicyModel } from 'generated/tdr';
import ManageWorkspacesModal from './ManageWorkspacesModal';
import SnapshotWorkspaceEntriesList from './SnapshotWorkspaceAccordionListEntries';

function getDefaultTitle(id: string | undefined): string {
  if (id) {
    return `Workspace ID ${id}`;
  }
  return '<UNKNOWN WORKSPACE>';
}

function getInaccessibleWorkspaceList(
  inaccessibleSnapshots: InaccessibleWorkspacePolicyModel[],
): SnapshotWorkspaceEntry[] {
  const snapshotWorkspaceList: Array<SnapshotWorkspaceEntry> = [];
  inaccessibleSnapshots.forEach((element) => {
    const workspaceEntry = {
      title: getDefaultTitle(element.workspaceId),
      link: null,
      id: element.workspaceId,
      policyModels: element.workspacePolicies,
    } as SnapshotWorkspaceEntry;
    snapshotWorkspaceList.push(workspaceEntry);
  });
  return snapshotWorkspaceList;
}

function getAccessibleWorkspaceList(
  accessibleSnapshots: WorkspacePolicyModel[],
): SnapshotWorkspaceEntry[] {
  const snapshotWorkspaceList: Array<SnapshotWorkspaceEntry> = [];
  accessibleSnapshots.forEach((element) => {
    const workspaceEntry = {
      title: element.workspaceName ? element.workspaceName : getDefaultTitle(element.workspaceId),
      link: element.workspaceLink ? element.workspaceLink : null,
      id: element.workspaceId,
      policyModels: element.workspacePolicies,
    } as SnapshotWorkspaceEntry;
    snapshotWorkspaceList.push(workspaceEntry);
  });
  return snapshotWorkspaceList;
}

function compareWorkspaceListEntries(a: SnapshotWorkspaceEntry, b: SnapshotWorkspaceEntry) {
  return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
}

function SnapshotWorkspaceAccordionView(props: SnapshotWorkspaceViewProps) {
  const { accessibleWorkspaces, inaccessibleWorkspaces, removeWorkspace } = props;
  const entries: SnapshotWorkspaceEntry[] = [];
  Array.prototype.push.apply(entries, getAccessibleWorkspaceList(accessibleWorkspaces));
  Array.prototype.push.apply(entries, getInaccessibleWorkspaceList(inaccessibleWorkspaces));
  entries.sort(compareWorkspaceListEntries);
  const entryCount = entries.length;

  return (
    <>
      {entryCount > 0 && (
        <List
          aria-labelledby="workspace-list-subheader"
          sx={{ width: '100%' }}
          component="nav"
          data-cy="snapshot-workspace-list"
          subheader={
            <>
              <ListSubheader component="div" id="workspace-list-subheader">
                <Typography>Workspace IDs will show if you do not have access to them.</Typography>
              </ListSubheader>
              <ListSubheader>
                <ManageWorkspacesModal
                  modalText="Manage snapshot access to workspace readers"
                  entries={entries}
                  removeWorkspace={removeWorkspace}
                />
              </ListSubheader>
            </>
          }
        >
          <SnapshotWorkspaceEntriesList entries={entries} />
        </List>
      )}
      {entryCount === 0 && (
        <Typography
          sx={() => ({
            fontStyle: 'italic',
            textColor: 'primary.dark',
            color: 'primary.dark',
          })}
        >
          Not used by any workspaces.
        </Typography>
      )}
    </>
  );
}

type StateProps = {
  accessibleWorkspaces: WorkspacePolicyModel[];
  inaccessibleWorkspaces: InaccessibleWorkspacePolicyModel[];
};

function mapStateToProps(state: TdrState) {
  return {
    accessibleWorkspaces: state.snapshots.snapshotWorkspaces,
    inaccessibleWorkspaces: state.snapshots.snapshotInaccessibleWorkspaces,
  };
}

type SnapshotWorpsaceFunctionProps = {
  removeWorkspace: any;
};

type SnapshotWorkspaceViewProps = SnapshotWorpsaceFunctionProps & StateProps;

export default connect(mapStateToProps)(SnapshotWorkspaceAccordionView);
