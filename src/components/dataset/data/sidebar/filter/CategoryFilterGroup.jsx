import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { CategoryFilter } from './CategoryFilter';

function CategoryFilterGroup({ column, filterMap, handleChange, originalValues, table, values }) {
  const [selected, setSelected] = useState({});

  useEffect(() => {
    setSelected(_.get(filterMap, 'value', {}));
  }, [filterMap]);

  const handleFilterChange = (box) => {
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
