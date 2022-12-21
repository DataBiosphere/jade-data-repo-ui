import React from 'react';
import _ from 'lodash';
import { Box, Button, Paper, Typography } from '@mui/material';
import { TreeItem, TreeItemProps, TreeView } from '@mui/lab';
import { AddBoxOutlined, IndeterminateCheckBoxOutlined } from '@mui/icons-material';
import { alpha, CustomTheme } from '@mui/material/styles';
import { ClassNameMap, createStyles, WithStyles, withStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ColumnModel, TableModel } from '../../../generated/tdr';
import TerraTooltip from '../TerraTooltip';

const styles = (theme: CustomTheme) =>
  createStyles({
    root: {
      height: '100%',
      padding: 15,
      width: 350,
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
    schemaSection: {
      overflowY: 'auto',
      width: '100%',
    },
    columnLabel: {
      whiteSpace: 'nowrap',
      display: 'flex',
      flexDirection: 'row',
    },
    columnBox: {
      background: '#e6e6e6',
      textAlign: 'center',
      borderRadius: 3,
      fontSize: 12,
      width: 18,
      height: 18,
      display: 'inline-block',
      paddingTop: 4,
      fontWeight: 700,
      lineHeight: '12px',
      marginRight: 4,
      position: 'relative',
    },
    columnSubscript: {
      position: 'absolute',
      fontSize: 8,
      top: 9,
      left: 12,
    },
    columnNameHighlight: {
      background: '#e6e6e6',
      borderRadius: 3,
      marginRight: '4px',
    },
    columnNamePlain: {
      paddingRight: 8,
      paddingLeft: 8,
      lineHeight: '1.1rem',
      maxWidth: 260,
      display: 'block',
    },
    ellipsis: {
      ...theme.mixins.ellipsis,
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
    marginLeft: 9,
    paddingLeft: 5,
    position: 'relative',
    '&:before': {
      content: '" "',
      position: 'absolute',
      top: 0,
      bottom: 25,
      left: -2,
      borderLeft: `2px dashed ${alpha(theme.palette.primary.main, 0.5)}`,
    },
    '&:after': {
      content: '" "',
      position: 'absolute',
      width: 10,
      height: 10,
      borderRadius: 10,
      bottom: 11,
      left: -6,
      backgroundColor: alpha(theme.palette.primary.main, 0.5),
    },
  },
  label: {
    marginTop: '2px',
    marginBottom: '2px',
  },
}))((props: TreeItemProps) => <TreeItem {...props} />);

interface IProps extends WithStyles<typeof styles> {
  resourceId: string;
  resourceType: string;
  tables: Array<TableModel>;
}

const renderTableName = (table: TableModel) => {
  const retVal = [<span key="name">{table.name}</span>];
  if (_.isNumber(table.rowCount)) {
    const noun = table.rowCount === 1 ? 'row' : 'rows';
    retVal.push(
      <span key="count" style={{ fontWeight: 500 }}>
        &nbsp;({table.rowCount} {noun})
      </span>,
    );
  }
  return retVal;
};

const renderColumnName = (
  column: ColumnModel,
  table: TableModel,
  classes: ClassNameMap<string>,
) => {
  const retVal = [];
  const isPk = _.includes(table.primaryKey || [], column.name);
  retVal.push(
    <span key="dt" className={classes.columnBox} title={column.datatype}>
      {column.datatype ? column.datatype.substring(0, 1).toUpperCase() : '?'}
      {column.array_of && <span className={classes.columnSubscript}>[ ]</span>}
    </span>,
  );
  retVal.push(
    <span
      key="name"
      className={clsx(classes.columnNamePlain, classes.ellipsis, {
        [classes.columnNameHighlight]: isPk,
      })}
    >
      {column.name}
      {column.required ? ' *' : ''}
    </span>,
  );

  const tooltipText = (
    <div>
      <p>
        Column <b>{column.name}</b> has datatype <b>{column.datatype || '(none)'}</b>
      </p>
      <ul>
        {isPk && <li>It is a primary key</li>}
        {column.required && <li>It is a required field</li>}
        {column.array_of && <li>It is an array field</li>}
      </ul>
    </div>
  );
  return (
    <TerraTooltip title={tooltipText}>
      <span className={classes.columnLabel}>{retVal}</span>
    </TerraTooltip>
  );
};

const datasetTables = (tables: Array<TableModel>, classes: ClassNameMap<string>) => (
  <TreeView
    aria-label="dataset schema navigator"
    data-cy="schema-navigator"
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
            <Typography
              data-cy="table-name"
              variant="h6"
              sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {renderTableName(table)}
            </Typography>
          </Box>
        }
      >
        {table.columns.map((column, j) => (
          <StyledTreeItem
            data-cy="column-name"
            key={`${i}${j}`}
            nodeId={`${i}${j}`}
            label={renderColumnName(column, table, classes)}
          />
        ))}
      </StyledTreeItem>
    ))}
  </TreeView>
);
const SchemaPanel = withStyles(styles)(({ classes, resourceId, resourceType, tables }: IProps) => (
  <Paper className={classes.root} elevation={4} data-cy="schema-panel">
    <Link to={`${resourceId}/data`} data-cy="view-data-link">
      <Button
        className={classes.viewDatasetButton}
        color="primary"
        variant="outlined"
        disableElevation
      >
        View {resourceType} Data
      </Button>
    </Link>

    <Typography data-cy="schema-header" className={classes.sectionHeader} variant="h5">
      {resourceType} Schema
    </Typography>
    <div>
      <Typography className={classes.sectionHeader} variant="h5" style={{ float: 'left' }}>
        Tables
      </Typography>
      <Typography data-cy="table-count" style={{ float: 'left', padding: '6px 0px' }}>
        &nbsp;({tables.length})
      </Typography>
    </div>
    <div className={classes.schemaSection}>{datasetTables(tables, classes)}</div>
  </Paper>
));

export default SchemaPanel;
