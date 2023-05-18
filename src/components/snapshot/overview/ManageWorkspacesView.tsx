import React from 'react';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import { SnapshotWorkspaceEntry } from 'models/workspaceentry';
import { Chip, CustomTheme } from '@mui/material';

const styles = (theme: CustomTheme) =>
  createStyles({
    workspaceChip: {
      margin: theme.spacing(1),
    },
    workspaceChipContainer: {
      margin: theme.spacing(1),
      maxHeight: theme.spacing(20),
      overflowY: 'scroll',
      width: '100%',
    },
  });

interface ManageWorkspaceViewProps extends WithStyles<typeof styles> {
  entries: SnapshotWorkspaceEntry[];
  removeWorkspace: any;
}

export class ManageWorkspacesView extends React.PureComponent<ManageWorkspaceViewProps> {
  render() {
    const { classes, entries, removeWorkspace } = this.props;
    const workspaceChips =
      !!entries &&
      entries.map((entry) => (
        <div key={entry.id}>
          <Chip
            className={classes.workspaceChip}
            color="primary"
            label={entry.title}
            key={entry.id}
            onDelete={() => removeWorkspace(entry.policyModels)}
            variant="outlined"
          />
        </div>
      ));
    return (
      <div>
        {entries && entries.length > 0 && (
          <div className={classes.workspaceChipContainer}>{workspaceChips}</div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ManageWorkspacesView);
