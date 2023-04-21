import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { withStyles, WithStyles, ClassNameMap, createStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { DatasetModel, ColumnModel } from 'generated/tdr';
import RangeFilter from './RangeFilter';
import CategoryWrapper from './CategoryWrapper';
import { ColumnTextValues } from './FilterTypes';

const styles = () =>
  createStyles({
    buttonContainer: {
      textAlign: 'end',
    },
  });

// TODO - move this to a common location to share with FilterPanel.tsx
type FilterType = {
  exclude: any;
  value: any;
  type: any;
};
type FilterMap = any;

interface FilterPanelItemProps extends WithStyles<typeof styles> {
  classes: ClassNameMap;
  column: ColumnModel;
  dataset: DatasetModel;
  filterData: any;
  filterStatement: string;
  handleFilterChange: (column: string, filter: FilterType, table: string) => void;
  joinStatement: string;
  tableName: string;
  token: string;
}

function FilterPanelItem({
  classes,
  column,
  dataset,
  filterData,
  filterStatement,
  handleFilterChange,
  joinStatement,
  tableName,
  token,
}: FilterPanelItemProps) {
  const [filterMap, setFilterMap] = useState<FilterMap>({});
  const [disableButton, setDisableButton] = useState(true);

  // The 'apply' button should only be enabled when there are new changes to be applied.
  // Comparing against prevProps and prevState will find if a change has been made.
  useEffect(() => {
    // enable the button when there are unsaved changes
    setDisableButton(invalidChange(filterMap));
  }, [filterMap]);

  useEffect(() => {
    // disable the button when filters have just been applied
    setDisableButton(true);
    const filters = _.get(filterData, [tableName, column.name], {});
    setFilterMap(filters);
  }, [filterData, tableName, column.name]);

  const handleChange = (value: ColumnTextValues) => {
    const type = ['string', 'text'].includes(column?.datatype) ? 'value' : 'range';
    const exclude = _.get(filterMap, 'exclude', false);
    setFilterMap({ value, type, exclude });
  };

  const applyFilters = () => {
    handleFilterChange(column.name, filterMap, tableName);
    setDisableButton(true);
  };

  // mark the filter as 'exclude' when the checkbox has been checked
  const toggleExclude = (boxIsChecked: boolean) => {
    setFilterMap({ ...filterMap, exclude: boxIsChecked });
  };

  const invalidChange = (map: any) => {
    const { value } = map;
    if (map.type === 'range') {
      const badNumber = (num: any) => num === '' || num.endsWith('.') || isNaN(num);
      return _.some(value, badNumber) || parseFloat(value[0]) > parseFloat(value[1]);
    }
    return _.isEmpty(value);
  };

  const item = ((datatype) => {
    switch (_.toLower(datatype)) {
      case 'string':
      case 'text':
        return (
          <CategoryWrapper
            column={column}
            dataset={dataset}
            filterMap={filterMap}
            filterStatement={filterStatement}
            joinStatement={joinStatement}
            handleChange={handleChange}
            handleFilters={applyFilters}
            tableName={tableName}
            token={token}
            toggleExclude={toggleExclude}
          />
        );
      case 'float':
      case 'integer':
        return (
          <RangeFilter
            column={column}
            dataset={dataset}
            filterMap={filterMap}
            handleChange={handleChange}
            handleFilters={applyFilters}
            tableName={tableName}
            token={token}
          />
        );
      default:
        return <div />;
    }
  })(column.datatype);
  return (
    <div>
      {item}
      <div className={classes.buttonContainer}>
        <Button
          onClick={applyFilters}
          variant="contained"
          disableElevation
          disabled={disableButton}
          size="small"
          data-cy={`filter-${column.name}-button`}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}

export default withStyles(styles)(FilterPanelItem);
