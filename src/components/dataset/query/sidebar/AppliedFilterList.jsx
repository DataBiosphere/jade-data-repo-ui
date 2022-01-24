import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import { Chip, Collapse, Badge } from '@material-ui/core';
import { ExpandLess } from '@material-ui/icons';
import { applyFilters } from '../../../../actions';

const styles = (theme) => ({
  filterHeader: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
    lineHeight: 'inherit',
  },
  rangeInfo: {
    display: 'inline-block',
  },
  inline: {
    margin: '2px',
  },
  tableName: {
    justifyContent: 'space-between',
    fontWeight: 500,
  },
  box: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(
      2,
    )}px`,
  },
  smallText: {
    'font-size': '.75rem',
  },
});

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 12,
    top: 0,
    backgroundColor: theme.palette.primary.lightContrast,
  },
}))(Badge);

export class AppliedFilterList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    filterData: PropTypes.object,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    selected: PropTypes.string,
    table: PropTypes.string,
  };

  handleExpand = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  clearFilter = (table, filter, datum) => {
    const { dispatch, filterData, dataset, selected } = this.props;
    const clonedData = _.cloneDeep(filterData);
    const clonedFilter = clonedData[table][filter];
    const filterValue = clonedFilter.value;

    if (clonedFilter.type !== 'range') {
      if (Array.isArray(filterValue)) {
        filterValue.splice(filterValue.indexOf(datum), 1);
      }
      if (_.isPlainObject(filterValue)) {
        delete filterValue[datum];
      }
    }

    if (_.isEmpty(filterValue) || clonedFilter.type === 'range') {
      delete clonedData[table][filter];
    }

    if (_.isEmpty(clonedData[table])) {
      delete clonedData[table];
    }

    dispatch(applyFilters(clonedData, selected, dataset));
  };

  render() {
    const { classes, filterData, table } = this.props;
    const { open } = this.state;
    let numFilters = 0;
    const listFilters = _.keys(filterData[table]).map((filter) => {
      const data = _.get(filterData[table], filter);
      let dataString = data.value;
      let isExcluded = data.exclude;

      if (data.type === 'range') {
        const enDash = ' \u2013 '; // it's a longer hyphen used to represent numerical ranges
        dataString = (
          <Chip
            onDelete={() => this.clearFilter(table, filter)}
            className={classes.inline}
            label={_.join(data.value, enDash)}
          />
        );
        numFilters++;
      } else {
        if (_.isPlainObject(data.value)) {
          dataString = _.keys(data.value);
        }
        dataString = dataString.map((datum, i) => (
          <Chip
            key={i}
            onDelete={() => this.clearFilter(table, filter, datum)}
            className={classes.inline}
            label={datum}
          />
        ));
        numFilters += dataString.length;
      }

      return (
        <List
          key={filter}
          subheader={
            <ListSubheader className={classes.filterHeader} component="div">
              {filter} {isExcluded ? <i className={classes.smallText}>   Marked as Excluded</i> : ''}
            </ListSubheader>
          }
        >
          <ListItem className={classes.rangeInfo} dense={true}>
            {dataString}
          </ListItem>
        </List>
      );
    });

    return (
      <div data-cy={`appliedFilterList-${table}`}>
        <ListItem className={classes.tableName} button onClick={() => this.handleExpand()}>
          {table}
          {open ? <ExpandLess /> : <StyledBadge badgeContent={numFilters} />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Card variant="outlined" className={classes.box}>
            {listFilters}
          </Card>
        </Collapse>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    filterData: state.query.filterData,
    dataset: state.datasets.dataset,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(AppliedFilterList));
