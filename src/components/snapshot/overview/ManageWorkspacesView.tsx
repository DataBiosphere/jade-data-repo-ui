import React from 'react';
import { SnapshotWorkspaceEntry } from 'models/workspaceentry';
import { Chip, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ChipContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
  maxHeight: theme.spacing(20),
  overflowY: 'scroll',
  width: '100%',
}));

interface ManageWorkspaceViewProps {
  readonly entries: SnapshotWorkspaceEntry[];
  readonly removeWorkspace: any;
}

export function ManageWorkspacesView(props: ManageWorkspaceViewProps) {
  const { entries, removeWorkspace } = props;
  const workspaceChips =
    !!entries &&
    entries.map((entry) => (
      <Box key={entry.id}>
        <Chip
          sx={{ margin: 1 }}
          color="primary"
          label={entry.title}
          key={entry.id}
          onDelete={() => removeWorkspace(entry.policyModels)}
          variant="outlined"
        />
      </Box>
    ));
  return (
    <Box>{entries && entries.length > 0 && <ChipContainer>{workspaceChips}</ChipContainer>}</Box>
  );
}

export default ManageWorkspacesView;
