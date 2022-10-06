import React from 'react';
import { TdrState } from 'reducers';
import { connect } from 'react-redux';
import { PolicyModel, SnapshotModel } from 'generated/tdr';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CustomTheme,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Action, Dispatch } from 'redux';
import { SnapshotRoles } from '../../../constants';
import { removeSnapshotPolicyMembers } from '../../../actions';
import SnapshotWorkspaceAccordionView from './SnapshotWorkspaceAccordionView';

function styles(theme: CustomTheme) {
  return createStyles({
    snapshotAccordion: {
      width: '75%',
    },
    snapshotAccordionSummary: {
      fontSize: '14px',
      lineHeight: '22px',
      fontWeight: '600',
      color: theme.palette.primary.main,
    },
    snapshotAccordionTitle: {
      fontWeight: 500,
    },
  });
}

type StateProps = {
  snapshot: SnapshotModel;
  dispatch: Dispatch<Action>;
};

type SnapshotWorkspaceProps = StateProps & WithStyles<typeof styles>;

function SnapshotWorkspace(props: SnapshotWorkspaceProps) {
  const { classes, snapshot, dispatch } = props;

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
    <Accordion defaultExpanded className={classes.snapshotAccordion}>
      <AccordionSummary
        data-cy="snapshot-workspace-accordion"
        className={classes.snapshotAccordionSummary}
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.snapshotAccordionTitle}>
          Workspaces with this snapshot
        </Typography>
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

export default connect(mapStateToProps)(withStyles(styles)(SnapshotWorkspace));
