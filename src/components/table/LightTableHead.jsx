import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { connect } from 'react-redux';

import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Sort } from '@mui/icons-material';
import TerraTooltip from '../common/TerraTooltip';

const styles = (theme) => ({
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

function LightTableHead({
  classes,
  columns,
  onRequestSort,
  orderDirection,
  orderProperty,
  summary,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className={classes.head}>
      <TableRow>
        {columns.map(
          (col) => (
            <TableCell
              className={classes.cell}
              key={col.name}
              align="left"
              padding="normal"
              sortDirection={orderProperty === col.name ? orderDirection : false}
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
          ),
          this,
        )}
      </TableRow>
    </TableHead>
  );
}

LightTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object),
  onRequestSort: PropTypes.func.isRequired,
  orderDirection: PropTypes.string.isRequired,
  orderProperty: PropTypes.string.isRequired,
  summary: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    orderDirection: state.query.orderDirection,
    orderProperty: state.query.orderProperty,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(LightTableHead));
