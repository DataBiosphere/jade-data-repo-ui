import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { TreeItem, TreeItemProps, TreeView } from '@mui/lab';
import { AddBoxOutlined, IndeterminateCheckBoxOutlined } from '@mui/icons-material';
import { alpha, CustomTheme } from '@mui/material/styles';
import { ClassNameMap, createStyles, withStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { TableModel } from '../../../generated/tdr';

const styles = (theme: CustomTheme) =>
  createStyles({
    root: {
      height: '100%',
      padding: '15px',
    },
    headerText: {
      fontWeight: theme.typography.bold,
      textTransform: 'uppercase',
    },
    sectionHeader: {
      padding: '6px 0px',
    },
    viewDatasetButton: {
      width: '100%',
      marginBottom: '12px',
    },
  });

const StyledTreeItem = withStyles((theme) => ({
  content: {
    padding: 0,
    backgroundColor: 'white !important',
    cursor: 'default',
  },
  iconContainer: {
    cursor: 'pointer',
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 5,
    borderLeft: `2px dashed ${alpha(theme.palette.primary.main, 0.5)}`,
  },
  label: {
    marginTop: '4px',
    marginBottom: '4px',
  },
}))((props: TreeItemProps) => <TreeItem {...props} />);

type SchemaPanelProps = {
  classes: ClassNameMap;
  resourceId: string;
  resourceType: string;
  tables: Array<TableModel>;
};

const datasetTables = (tables: Array<TableModel>) => (
  <TreeView
    aria-label="dataset schema navigator"
    defaultCollapseIcon={<IndeterminateCheckBoxOutlined color="primary" />}
    defaultExpandIcon={<AddBoxOutlined color="primary" />}
    defaultExpanded={['0']}
  >
    {tables.map((table: TableModel, i: number) => (
      <StyledTreeItem
        key={`${i}`}
        nodeId={`${i}`}
        label={
          <Box sx={{ cursor: 'pointer' }}>
            <Typography variant="h6" sx={{ cursor: 'pointer' }}>
              {table.name}
            </Typography>
          </Box>
        }
      >
        {table.columns.map((column, j) => (
          <StyledTreeItem key={`${i}${j}`} nodeId={`${i}${j}`} label={column.name} />
        ))}
      </StyledTreeItem>
    ))}
  </TreeView>
);

function SchemaPanel(props: SchemaPanelProps) {
  const { classes, resourceId, resourceType, tables } = props;
  return (
    <Paper className={classes.root} elevation={4}>
      <Link to={`${resourceId}/data`}>
        <Button
          className={classes.viewDatasetButton}
          color="primary"
          variant="outlined"
          disableElevation
        >
          View {resourceType} Data
        </Button>
      </Link>

      <Typography className={classes.sectionHeader} variant="h5">
        {resourceType} Schema
      </Typography>
      <div>
        <Typography className={classes.sectionHeader} variant="h5" style={{ float: 'left' }}>
          Tables
        </Typography>
        <Typography style={{ float: 'left', padding: '6px 0px' }}>({tables.length})</Typography>
      </div>
      {datasetTables(tables)}
    </Paper>
  );
}

export default withStyles(styles)(SchemaPanel);
