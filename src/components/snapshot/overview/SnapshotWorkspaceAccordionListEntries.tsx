import React from 'react';
import { Launch } from '@mui/icons-material';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import { SnapshotWorkspaceEntry } from '../../../models/workspaceentry';

interface SnapshotWorkspaceEntriesListProps {
  entries: SnapshotWorkspaceEntry[];
}

export default function SnapshotWorkspaceEntriesList(props: SnapshotWorkspaceEntriesListProps) {
  const { entries } = props;
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
              <ListItemButton
                dense
                // @ts-ignore
                sx={(theme: CustomTheme) => ({
                  ...theme.mixins.jadeLink,
                })}
              >
                {entry.title}
                <ListItemIcon
                  // @ts-ignore
                  sx={(theme: CustomTheme) => ({
                    ...theme.mixins.jadeLink,
                    height: '0.75em',
                    width: '0.75em',
                  })}
                >
                  <Launch />
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
