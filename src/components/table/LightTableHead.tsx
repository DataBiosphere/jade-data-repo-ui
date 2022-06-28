import React from 'react';
import { connect } from 'react-redux';

import { SortDirection, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { Sort } from '@mui/icons-material';
import { CustomTheme } from '@mui/material/styles';
import { ClassNameMap, withStyles } from '@mui/styles';

import TerraTooltip from '../common/TerraTooltip';
import { TableColumnType, OrderDirectionOptions } from '../../reducers/query';
import { TdrState } from '../../reducers';

const styles = (theme: CustomTheme) => ({
  head: {
    color: theme.palette.primary.dark,
    backgroundColor: theme.palette.lightTable.cellBackgroundDark,
    fontFamily: theme.typography.fontFamily,
  },
  cell: {
    color: theme.palette.secondary.dark,
    minWidth: 200,
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: '16px',
    border: `1px solid ${theme.palette.lightTable.borderColor}`,
  },
});

type LightTableHeadProps = {
  classes: ClassNameMap;
  columns: Array<TableColumnType>;
  onRequestSort: (event: any, property: string) => void;
  orderDirection: OrderDirectionOptions;
  orderProperty: string;
  summary: boolean;
};

function LightTableHead({
  classes,
  columns,
  onRequestSort,
  orderDirection,
  orderProperty,
  summary,
}: LightTableHeadProps) {
  const createSortHandler = (property: string) => (event: any) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className={classes.head}>
      <TableRow>
        {columns.map((col: TableColumnType) => {
          const sortDir: SortDirection =
            orderProperty === col.name ? orderDirection ?? false : false;
          return (
            <TableCell
              className={classes.cell}
              key={col.name}
              align="left"
              padding="normal"
              sortDirection={sortDir}
              data-cy={`columnHeader-${col.name}`}
            >
              {summary || !col.allowSort ? (
                col.label ?? col.name
              ) : (
                <div>
                  {col.label ?? col.name}
                  <TerraTooltip
                    title="Sort"
                    placement={col.numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderProperty === col.name}
                      direction={orderDirection}
                      onClick={createSortHandler(col.name)}
                      IconComponent={Sort}
                      style={{ float: 'right' }}
                    />
                  </TerraTooltip>
                </div>
              )}
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
