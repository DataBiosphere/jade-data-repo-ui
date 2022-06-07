import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { CategoryFilter } from './CategoryFilter';
import { ColumnModel, TableModel } from 'generated/tdr';

// TODO Duplicated in FreetextFilter
type FilterMap = {
  exclude: boolean;
  value: Array<string>;
};

type CategoryFilterGroupProps = {
  column: ColumnModel;
  filterMap: FilterMap;
  handleChange: (value: (string | string[])[]) => null;
  originalValues: any;
  table: TableModel;
  values: any;
};
function CategoryFilterGroup({
  column,
  filterMap,
  handleChange,
  originalValues,
  table,
  values,
}: CategoryFilterGroupProps) {
  const [selected, setSelected] = useState<Array<string>>([]);

  useEffect(() => {
    setSelected(_.get(filterMap, 'value', []));
  }, [filterMap]);

  const handleFilterChange = (box: any) => {
    const selectedClone = _.clone(selected);
    if (box.value) {
      selectedClone[box.name] = box.value;
      setSelected(selectedClone);
    } else {
      delete selectedClone[box.name];
      setSelected(selectedClone);
    }
    handleChange(selectedClone);
  };

  const checkboxes = _.keys(originalValues).map((name) => {
    const count = parseInt(_.get(values, name, '0'), 10);
    return (
      <div key={name}>
        <CategoryFilter
          column={column}
          filterMap={filterMap}
          handleChange={handleFilterChange}
          name={name}
          count={count}
          table={table}
        />
      </div>
    );
  });

  return <div>{checkboxes}</div>;
}

CategoryFilterGroup.propTypes = {
  column: PropTypes.object,
  filterMap: PropTypes.object,
  handleChange: PropTypes.func,
  originalValues: PropTypes.object,
  table: PropTypes.string,
  values: PropTypes.object,
};

export default CategoryFilterGroup;
