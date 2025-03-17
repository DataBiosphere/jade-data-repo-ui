import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import { SortDirection, TableCell, TableHead, TableRow, TableSortLabel, Box } from '@mui/material';
import { CustomTheme, styled } from '@mui/material/styles';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltDown, faLongArrowAltUp } from '@fortawesome/free-solid-svg-icons';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { EllipsisBox, EllipsisSpan } from 'components/common/Ellipsis';
import { TableColumnType, OrderDirectionOptions } from '../../reducers/query';
import { TdrState } from '../../reducers';
import { TABLE_DEFAULT_SORT_ORDER } from '../../constants';

const Cell = styled(TableCell)(({ theme }) => {
  const customTheme = theme as CustomTheme;
  return {
    color: customTheme.palette.secondary.dark,
    minWidth: '30px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: '16px',
    backgroundColor: customTheme.palette.lightTable.cellBackgroundHeader,
    border: `1px solid ${customTheme.palette.lightTable.borderColor}`,
    borderTop: 'none',
    borderLeft: 'none',
    borderBottom: 'none',
    '&:last-child': {
      borderRight: 'none',
    },
    '&:after': {
      content: '" "',
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      height: '1px',
      backgroundColor: customTheme.palette.lightTable.borderColor,
    },
  };
});

const ColumnResizer = styled(DragIndicatorIcon)(({ theme }) => ({
  height: theme.spacing(3),
  width: theme.spacing(3),
  position: 'absolute',
  top: '13px',
  right: 0,
  cursor: 'ew-resize',
}));

const SortIcon = styled(FontAwesomeIcon)(({ theme }) => ({
  color: `${theme.palette.primary.main} !important`,
  width: '16px',
  height: '16px',
  marginRight: `-${theme.spacing(1)}`,
}));

const Label = styled('span')(({ theme }) => ({
  flex: 1,
  ...(theme as CustomTheme).mixins.ellipsis,
}));

type LightTableHeadProps = {
  columns: Array<TableColumnType>;
  onRequestSort: (event: any, property: string) => void;
  onResizeColumn: (event: any, property: string, size: number) => void;
  orderDirection: OrderDirectionOptions;
  orderProperty: string;
};

function LightTableHead({
  columns,
  onRequestSort,
  onResizeColumn,
  orderDirection,
  orderProperty,
}: LightTableHeadProps) {
  const [initialWidth, setInitialWidth] = React.useState<number | undefined>(undefined);
  const [deltaX, setDeltaX] = React.useState(0);
  const [draggingCol, setDraggingCol] = React.useState<TableColumnType | undefined>(undefined);

  const createSortHandler = (property: string) => (event: any) => {
    onRequestSort(event, property);
  };

  const createStartHandler: (column: TableColumnType) => DraggableEventHandler = (column) => (
    _event,
    data,
  ) => {
    if (!_.isNumber(column.width)) {
      setInitialWidth(data.node?.parentElement?.clientWidth);
    } else {
      setInitialWidth(column.width);
    }
    setDeltaX(0);
    setDraggingCol(column);
  };

  const createDragHandler: (column: TableColumnType) => DraggableEventHandler = (column) => (
    event,
    data,
  ) => {
    if (initialWidth !== undefined) {
      onResizeColumn(event, column.name, initialWidth + data.x);
    }
    setDeltaX(data.x);
  };

  const createStopHandler: (column: TableColumnType) => DraggableEventHandler = (column) => (
    event,
    data,
  ) => {
    if (initialWidth !== undefined) {
      onResizeColumn(event, column.name, initialWidth + data.x);
    }
    setDeltaX(0);
    setDraggingCol(undefined);
  };

  const createDragHandle = (col: TableColumnType) =>
    col.allowResize && (
      <Draggable
        axis="x"
        onStart={createStartHandler(col)}
        onDrag={createDragHandler(col)}
        onStop={createStopHandler(col)}
        position={{ x: 0, y: 0 }}
        positionOffset={{ x: draggingCol?.name === col.name ? -1 * deltaX : 0, y: 0 }}
      >
        <ColumnResizer />
      </Draggable>
    );

  return (
    <TableHead
      sx={{
        color: (theme) => theme.palette.primary.dark,
        backgroundColor: (theme) => (theme as CustomTheme).palette.lightTable.cellBackgroundDark,
        fontFamily: (theme) => theme.typography.fontFamily,
      }}
    >
      <TableRow>
        {columns.map((col: TableColumnType) => {
          const sortDir: SortDirection =
            orderProperty === col.name ? orderDirection ?? false : false;
          const maxWidth = _.isNumber(col.width) ? col.width : undefined;
          return (
            <Cell
              key={col.name}
              align="left"
              padding="normal"
              sortDirection={sortDir}
              width={col.width}
              data-cy={`columnHeader-${col.name}`}
            >
              <Box sx={{ maxWidth, display: 'flex' }}>
                {!col.allowSort ? (
                  <EllipsisBox style={{ width: maxWidth }}>
                    <EllipsisSpan sx={{ flex: 1 }}>{col.label ?? col.name}</EllipsisSpan>
                    {createDragHandle(col)}
                  </EllipsisBox>
                ) : (
                  <div style={{ display: 'flex', flex: 1 }}>
                    <TableSortLabel
                      active={orderProperty === col.name}
                      data-cy={`columnSort-${col.name}`}
                      direction={sortDir || TABLE_DEFAULT_SORT_ORDER}
                      onClick={createSortHandler(col.name)}
                      IconComponent={
                        sortDir
                          ? () => (
                            <SortIcon
                              icon={sortDir === 'asc' ? faLongArrowAltDown : faLongArrowAltUp}
                              sx={{
                                marginRight: col.allowResize ? (theme) => theme.spacing(1) : 0,
                              }}
                            />
                          )
                          : undefined
                      }
                      style={{ width: maxWidth, flex: 1 }}
                    >
                      <Label>{col.label ?? col.name}</Label>
                    </TableSortLabel>
                    {createDragHandle(col)}
                  </div>
                )}
              </Box>
            </Cell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    orderDirection: state.query.orderDirection,
    orderProperty: state.query.orderProperty,
  };
}

export default connect(mapStateToProps)(LightTableHead);
