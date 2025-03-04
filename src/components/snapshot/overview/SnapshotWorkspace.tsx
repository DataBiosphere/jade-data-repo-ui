import React from 'react';
import { TdrState } from 'reducers';
import { connect } from 'react-redux';
import { PolicyModel, SnapshotModel } from 'generated/tdr';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Action, Dispatch } from 'redux';
import { SnapshotRoles } from '../../../constants';
import { removeSnapshotPolicyMembers } from '../../../actions';
import SnapshotWorkspaceAccordionView from './SnapshotWorkspaceAccordionView';

type StateProps = {
  readonly snapshot: SnapshotModel;
  readonly dispatch: Dispatch<Action>;
};

function SnapshotWorkspace(props: StateProps) {
  const { snapshot, dispatch } = props;

  const removeWorkspace = (policyModels: PolicyModel[]) => {
    const membersToRemove: string[] = [];
    policyModels.forEach((policy) => {
      policy.members &&
        policy.members.forEach((member) => {
          membersToRemove.push(member);
        });
    });
    dispatch(removeSnapshotPolicyMembers(snapshot.id, membersToRemove, SnapshotRoles.READER));
  };

  return (
    <Accordion defaultExpanded sx={{ width: '75%' }}>
      <AccordionSummary
        data-cy="snapshot-workspace-accordion"
        sx={{
          fontSize: '14px',
          lineHeight: '22px',
          fontWeight: '600',
          color: 'primary.main',
        }}
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography sx={{ fontWeight: 500 }}>Snapshot Reader Workspaces</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <SnapshotWorkspaceAccordionView removeWorkspace={removeWorkspace} />
      </AccordionDetails>
    </Accordion>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    snapshot: state.snapshots.snapshot,
    snapshotWorkspaces: state.snapshots.snapshotWorkspaces,
    snapshotInaccessibleWorkspaces: state.snapshots.snapshotInaccessibleWorkspaces,
  };
}

export default connect(mapStateToProps)(SnapshotWorkspace);
