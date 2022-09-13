import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import { SortDirection, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import { ClassNameMap, withStyles } from '@mui/styles';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import { Property } from 'csstype';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltUp } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import { TableColumnType, OrderDirectionOptions } from '../../reducers/query';
import { TdrState } from '../../reducers';
import { TABLE_DEFAULT_SORT_ORDER } from '../../constants';
import { ReactComponent as ColumnGrabberIcon } from '../../media/icons/column_grabber.svg';

const styles = (theme: CustomTheme) => ({
  head: {
    color: theme.palette.primary.dark,
    backgroundColor: theme.palette.lightTable.cellBackgroundDark,
    fontFamily: theme.typography.fontFamily,
  },
  cell: {
    color: theme.palette.secondary.dark,
    minWidth: 30,
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: '16px',
    backgroundColor: theme.palette.lightTable.cellBackgroundHeader,
    border: `1px solid ${theme.palette.lightTable.borderColor}`,
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
      height: 1,
      backgroundColor: theme.palette.lightTable.borderColor,
    },
  },
  cellContent: {
    display: 'flex',
  },
  nonSortableCell: {
    ...theme.mixins.ellipsis,
  },
  // Typescript coaxing to combine the ellipsis mixin with other CSS properties
  // eslint-disable-next-line prefer-object-spread
  label: Object.assign({ flex: 1 }, theme.mixins.ellipsis),
  columnResizer: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    position: 'absolute' as Property.Position,
    top: 13,
    right: 0,
    cursor: 'ew-resize',
  },
  cellInner: {
    flex: 1,
    display: 'flex',
  },
  sortIcon: {
    color: `${theme.palette.primary.main} !important`,
    width: 16,
    height: 16,
    marginRight: `-${theme.spacing(1)}`,
  },
  allowsResize: {
    marginRight: theme.spacing(1),
  },
});

type LightTableHeadProps = {
  classes: ClassNameMap;
  columns: Array<TableColumnType>;
  onRequestSort: (event: any, property: string) => void;
  onResizeColumn: (event: any, property: string, size: number) => void;
  orderDirection: OrderDirectionOptions;
  orderProperty: string;
};

function LightTableHead({
  classes,
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
        // Make sure that the drag handle stays where it should while dragging by negating the drag delta
        positionOffset={{ x: draggingCol?.name === col.name ? -1 * deltaX : 0, y: 0 }}
      >
        <ColumnGrabberIcon className={classes.columnResizer} />
      </Draggable>
    );

  return (
    <TableHead className={classes.head}>
      <TableRow>
        {columns.map((col: TableColumnType) => {
          const sortDir: SortDirection =
            orderProperty === col.name ? orderDirection ?? false : false;
          const maxWidth = _.isNumber(col.width) ? col.width : undefined;
          return (
            <TableCell
              className={classes.cell}
              key={col.name}
              align="left"
              padding="normal"
              sortDirection={sortDir}
              width={col.width}
              data-cy={`columnHeader-${col.name}`}
            >
              <div className={classes.cellContent} style={{ maxWidth }}>
                {!col.allowSort ? (
                  <div
                    className={clsx(classes.cellInner, classes.nonSortableCell)}
                    style={{ width: maxWidth }}
                  >
                    <span className={classes.label}>{col.label ?? col.name}</span>
                    {createDragHandle(col)}
                  </div>
                ) : (
                  <div className={classes.cellInner}>
                    <TableSortLabel
                      active={orderProperty === col.name}
                      direction={sortDir || TABLE_DEFAULT_SORT_ORDER}
                      onClick={createSortHandler(col.name)}
                      IconComponent={({ className }) => {
                        return (
                          <FontAwesomeIcon
                            className={clsx(className, classes.sortIcon, {
                              [classes.allowsResize]: col.allowResize,
                            })}
                            icon={faLongArrowAltUp}
                          />
                        );
                      }}
                      style={{ width: maxWidth, flex: 1 }}
                    >
                      <span className={classes.label}>{col.label ?? col.name}</span>
                    </TableSortLabel>
                    {createDragHandle(col)}
                  </div>
                )}
              </div>
            </TableCell>
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

export default connect(mapStateToProps)(withStyles(styles)(LightTableHead));
