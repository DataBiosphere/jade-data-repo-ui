import React from 'react';
import _ from 'lodash';
import { Box, Button, IconButtonProps, Paper, Typography, iconButtonClasses } from '@mui/material';
import { TreeItem, TreeItemProps, TreeView, treeItemClasses } from '@mui/lab';
import {
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
  RadioButtonUncheckedOutlined,
  RadioButtonCheckedOutlined,
} from '@mui/icons-material';
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
    readOnly: {
      [`& .${treeItemClasses.content}`]: {
        backgroundColor: 'white !important',
        cursor: 'default',
      },
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
    columnLabelIcons: {
      [`& .${iconButtonClasses.root}`]: {
        display: 'flex',
        marginTop: 0,
      },
    },
    columnBox: {
      background: '#e6e6e6',
      textAlign: 'center',
      borderRadius: 3,
      fontSize: 12,
      width: 18,
      minWidth: 18,
      height: 18,
      display: 'inline-block',
      paddingTop: 4,
      fontWeight: 700,
      lineHeight: '9px',
      marginTop: 1,
      marginRight: 4,
      position: 'relative',
      border: '1px solid #d0d0d0',
    },
    columnSubscript: {
      position: 'absolute',
      fontSize: 8,
      top: 9,
      left: 12,
    },
    columnNameHighlight: {
      background: '#e6e6e6',
      marginRight: '4px',
    },
    highlight: {
      border: `1px solid ${theme.palette.primary.main} !important`,
    },
    columnNamePlain: {
      paddingRight: 8,
      paddingLeft: 8,
      lineHeight: '1.1rem',
      display: 'block',
      borderRadius: 3,
      border: '1px solid transparent',
    },
    columnNode: {
      [`& .${treeItemClasses.content}`]: {
        paddingTop: 2,
        paddingRight: 0,
        paddingBottom: 2,
        paddingLeft: 0,
      },
      [`& .${treeItemClasses.iconContainer}`]: {
        display: 'none',
      },
    },
    radioIcon: {
      marginRight: 7,
    },
    ellipsis: {
      ...theme.mixins.ellipsis,
    },
  });

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    cursor: 'pointer',
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 14,
    paddingLeft: 18,
    borderLeft: `2px dashed ${alpha(theme.palette.primary.main, 0.5)}`,
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
  selected: boolean,
  highlighted: boolean,
  afterLabelIcons?: (table: TableModel, column: ColumnModel) => LabelIcon[],
  selectedColumnnsAsRadio?: boolean,
) => {
  const retVal = [];

  if (selectedColumnnsAsRadio && column) {
    if (selected) {
      retVal.push(
        <RadioButtonCheckedOutlined
          className={classes.radioIcon}
          color="primary"
          fontSize="small"
        />,
      );
    } else {
      retVal.push(
        <RadioButtonUncheckedOutlined
          className={classes.radioIcon}
          color="primary"
          fontSize="small"
        />,
      );
    }
  }
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
        [classes.highlight]: highlighted,
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
    <span className={classes.columnLabel}>
      <TerraTooltip title={tooltipText} enterDelay={500} enterNextDelay={500}>
        <span style={{ display: 'flex', maxWidth: '100%' }}>{retVal}</span>
      </TerraTooltip>
      <span className={classes.columnLabelIcons}>
        {afterLabelIcons &&
          afterLabelIcons(table, column).map((i) =>
            _.isEmpty(i.tooltip) ? (
              i.icon
            ) : (
              <TerraTooltip title={i.tooltip || ''}>{i.icon}</TerraTooltip>
            ),
          )}
      </span>
    </span>
  );
};

export interface LabelIcon {
  icon: React.ReactElement<IconButtonProps>;
  tooltip?: string | JSX.Element;
}

interface IPanelProps extends WithStyles<typeof styles> {
  // Tables to render
  tables: Array<TableModel>;
  // If true, will remove hover styling
  readOnly?: boolean;
  // If true, render a radio button to represent selection for columns
  selectedColumnnsAsRadio?: boolean;
  // Selected node by id where the id is either {table index} if the selected node is a table or {table index}-{column index} if the selected node is a column
  selected?: string;
  // If passed in, callback method to execute when any node gets selected
  onNodeSelect?: (event: React.SyntheticEvent, nodeId: string) => void;
  // Expanded nodes by id where the id is the {table index}
  expanded?: Array<string>;
  // Highlighted nodes by id where the id is the {table index}-{column index}
  highlighted?: Array<string>;
  // If passed in, callback method to execute when any node gets toggled
  onNodeToggle?: (event: React.SyntheticEvent, nodeIds: string[]) => void;
  // Array of react elements to add before a column label
  beforeLabelIcons?: React.ReactElement[];
  // Array of react elements to add after a column label
  afterLabelIcons?: (table: TableModel, column: ColumnModel) => LabelIcon[];
}
export const SchemaTree = withStyles(styles)(
  ({
    classes,
    tables,
    selectedColumnnsAsRadio,
    selected,
    onNodeSelect,
    expanded,
    highlighted,
    onNodeToggle,
    afterLabelIcons,
    readOnly,
  }: IPanelProps) => (
    <TreeView
      aria-label="dataset schema navigator"
      data-cy="schema-navigator"
      defaultCollapseIcon={<IndeterminateCheckBoxOutlined color="primary" />}
      defaultExpandIcon={<AddBoxOutlined color="primary" />}
      defaultParentIcon={<AddBoxOutlined color="primary" />}
      defaultExpanded={tables.length > 0 ? ['0'] : []}
      selected={selected}
      onNodeSelect={onNodeSelect}
      expanded={expanded}
      onNodeToggle={onNodeToggle}
    >
      {tables.map((table: TableModel, i: number) => (
        <StyledTreeItem
          key={`${i}`}
          nodeId={`${i}`}
          className={clsx({ [classes.readOnly]: readOnly })}
          icon={table.columns.length === 0 && <IndeterminateCheckBoxOutlined color="disabled" />}
          TransitionProps={{
            timeout: 0,
          }}
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
              key={`${i}-${j}`}
              nodeId={`${i}-${j}`}
              className={classes.columnNode}
              label={renderColumnName(
                column,
                table,
                classes,
                !_.isEmpty(selected) && selected === `${i}-${j}`,
                (highlighted || []).indexOf(`${i}-${j}`) > -1,
                afterLabelIcons,
                selectedColumnnsAsRadio,
              )}
            />
          ))}
        </StyledTreeItem>
      ))}
    </TreeView>
  ),
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
    <div className={classes.schemaSection}>
      <SchemaTree tables={tables} readOnly />
    </div>
  </Paper>
));

export default SchemaPanel;
