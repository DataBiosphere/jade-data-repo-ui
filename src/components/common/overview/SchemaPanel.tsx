import React from 'react';
import _ from 'lodash';
import {
  Box,
  Button,
  IconButtonProps,
  Paper,
  Typography,
  iconButtonClasses,
  useTheme,
} from '@mui/material';
import { TreeItem, TreeView, treeItemClasses } from '@mui/lab';
import {
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
  RadioButtonUncheckedOutlined,
  RadioButtonCheckedOutlined,
} from '@mui/icons-material';
import { alpha, CustomTheme, styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { ColumnModel, TableModel } from '../../../generated/tdr';
import TerraTooltip from '../TerraTooltip';

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    cursor: 'pointer',
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 14,
    paddingLeft: 18,
    borderLeft: `2px dashed ${alpha(theme.palette.primary.main, 0.5)}`,
  },
  [`& .${treeItemClasses.label}`]: {
    marginTop: '2px',
    marginBottom: '2px',
  },
}));

const ColumnLabelIcons = styled('span')(() => ({
  [`& .${iconButtonClasses.root}`]: {
    display: 'flex',
    marginTop: 0,
  },
}));

const ColumnNodeTreeItem = styled(StyledTreeItem)(() => ({
  [`& .${treeItemClasses.content}`]: {
    paddingTop: 2,
    paddingRight: 0,
    paddingBottom: 2,
    paddingLeft: 0,
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    display: 'none',
  },
}));

const ReadOnlyTreeItem = styled(StyledTreeItem)(() => ({
  [`& .${treeItemClasses.content}`]: {
    backgroundColor: 'white !important',
    cursor: 'default',
  },
}));

const ColumnLabel = styled('span')(() => ({
  whiteSpace: 'nowrap',
  display: 'flex',
  flexDirection: 'row',
}));

const ColumnBox = styled('span')(() => ({
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
}));

const ColumnSubscript = styled('span')(() => ({
  position: 'absolute',
  fontSize: 8,
  top: 9,
  left: 12,
}));

const columnNameHighlight = {
  background: '#e6e6e6',
  marginRight: '4px',
};

const highlight = (theme: CustomTheme) => ({
  border: `1px solid ${theme.palette.primary.main} !important`,
});

interface ColumnNameProps {
  theme: CustomTheme;
  isPrimaryKey?: boolean;
  isHighlighted?: boolean;
}

const ColumnName = styled('span')(({ theme, isPrimaryKey, isHighlighted }: ColumnNameProps) => ({
  paddingRight: 8,
  paddingLeft: 8,
  lineHeight: '1.1rem',
  display: 'block',
  borderRadius: 3,
  border: '1px solid transparent',
  ...theme.mixins.ellipsis,
  ...(isPrimaryKey ? columnNameHighlight : {}),
  ...(isHighlighted ? highlight(theme) : {}),
}));

interface IProps {
  resourceId: string | undefined;
  resourceType: string | undefined;
  tables: Array<TableModel> | undefined;
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
  selected: boolean,
  highlighted: boolean,
  theme: CustomTheme,
  afterLabelIcons?: (table: TableModel, column: ColumnModel) => LabelIcon[],
  selectedColumnnsAsRadio?: boolean,
) => {
  const retVal = [];

  if (selectedColumnnsAsRadio && column) {
    if (selected) {
      retVal.push(
        <RadioButtonCheckedOutlined
          key="radio"
          sx={{
            marginRight: 7,
          }}
          color="primary"
          fontSize="small"
        />,
      );
    } else {
      retVal.push(
        <RadioButtonUncheckedOutlined
          key="radio"
          sx={{
            marginRight: 7,
          }}
          color="primary"
          fontSize="small"
        />,
      );
    }
  }
  const isPk = _.includes(table.primaryKey || [], column.name);
  retVal.push(
    <ColumnBox key="dt" title={column.datatype}>
      {column.datatype ? column.datatype.substring(0, 1).toUpperCase() : '?'}
      {column.array_of && <ColumnSubscript>[ ]</ColumnSubscript>}
    </ColumnBox>,
  );
  retVal.push(
    <ColumnName isPrimaryKey={isPk} isHighlighted={highlighted} theme={theme} key="name">
      {column.name}
      {column.required ? ' *' : ''}
    </ColumnName>,
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
    <ColumnLabel>
      <TerraTooltip title={tooltipText} enterDelay={500} enterNextDelay={500}>
        <span style={{ display: 'flex', maxWidth: '100%' }}>{retVal}</span>
      </TerraTooltip>
      <ColumnLabelIcons>
        {afterLabelIcons &&
          afterLabelIcons(table, column).map((i, index) =>
            _.isEmpty(i.tooltip) ? (
              <span key={index}>{i.icon}</span>
            ) : (
              <TerraTooltip key={index} title={i.tooltip || ''}>
                {i.icon}
              </TerraTooltip>
            ),
          )}
      </ColumnLabelIcons>
    </ColumnLabel>
  );
};

export interface LabelIcon {
  icon: React.ReactElement<IconButtonProps>;
  tooltip?: string | JSX.Element;
}

interface IPanelProps {
  // Tables to render
  tables: Array<TableModel>;
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
  // Array of react elements to add after a column label
  afterLabelIcons?: (table: TableModel, column: ColumnModel) => LabelIcon[];
}
export function SchemaTree({
  tables,
  selectedColumnnsAsRadio,
  selected,
  onNodeSelect,
  expanded,
  highlighted,
  onNodeToggle,
  afterLabelIcons,
}: IPanelProps) {
  const theme = useTheme() as CustomTheme;
  return (
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
        <ReadOnlyTreeItem
          key={`${i}`}
          nodeId={`${i}`}
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
            <ColumnNodeTreeItem
              data-cy="column-name"
              key={`${i}-${j}`}
              nodeId={`${i}-${j}`}
              label={renderColumnName(
                column,
                table,
                !_.isEmpty(selected) && selected === `${i}-${j}`,
                (highlighted || []).indexOf(`${i}-${j}`) > -1,
                theme,
                afterLabelIcons,
                selectedColumnnsAsRadio,
              )}
            />
          ))}
        </ReadOnlyTreeItem>
      ))}
    </TreeView>
  );
}

function SchemaPanel({ resourceId, resourceType, tables }: IProps) {
  return (
    <Paper
      sx={{
        height: '100%',
        padding: '15px',
        width: 350,
      }}
      elevation={4}
      data-cy="schema-panel"
    >
      <Link to={`${resourceId}/data`} data-cy="view-data-link">
        <Button
          sx={{
            width: '100%',
            marginBottom: '12px',
          }}
          color="primary"
          variant="outlined"
          disableElevation
        >
          View {resourceType} Data
        </Button>
      </Link>

      <Typography
        data-cy="schema-header"
        sx={{
          padding: '6px 0px',
        }}
        variant="h5"
      >
        {resourceType} Schema
      </Typography>
      <div>
        <Typography
          sx={{
            padding: '6px 0px',
            float: 'left',
          }}
          variant="h5"
        >
          Tables
        </Typography>
        <Typography data-cy="table-count" style={{ float: 'left', padding: '6px 0px' }}>
          &nbsp;({tables?.length ?? 0})
        </Typography>
      </div>
      <div
        style={{
          overflowY: 'auto',
          width: '100%',
        }}
      >
        <SchemaTree tables={tables ?? []} />
      </div>
    </Paper>
  );
}

export default SchemaPanel;
