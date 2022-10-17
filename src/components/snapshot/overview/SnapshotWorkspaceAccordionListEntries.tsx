import React from 'react';
import { Launch } from '@mui/icons-material';
import { CustomTheme, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import { SnapshotWorkspaceEntry } from '../../../models/workspaceentry';

const styles = (theme: CustomTheme) =>
  createStyles({
    jadeLink: {
      ...theme.mixins.jadeLink,
    },
    jadeIconLink: {
      ...theme.mixins.jadeLink,
      height: '0.75em',
      width: '0.75em',
    },
  });

interface SnapshotWorkspaceEntriesListProps extends WithStyles<typeof styles> {
  entries: SnapshotWorkspaceEntry[];
}

function SnapshotWorkspaceEntriesList(props: SnapshotWorkspaceEntriesListProps) {
  const { entries, classes } = props;
  return (
    <>
      {entries.map((entry) => {
        if (entry.link) {
          return (
            <ListItem
              key={entry.id}
              button
              component="a"
              dense
              disableGutters
              target="_blank"
              href={entry.link}
            >
              <ListItemButton dense className={classes.jadeLink}>
                {entry.title}
                <ListItemIcon className={classes.jadeLink}>
                  <Launch className={classes.jadeIconLink} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          );
        }
        return (
          <ListItem key={entry.id}>
            <ListItemText>{entry.title}</ListItemText>
          </ListItem>
        );
      })}
    </>
  );
}

export default withStyles(styles)(SnapshotWorkspaceEntriesList);
