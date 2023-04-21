import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { ColumnModel } from 'generated/tdr';
import { CategoryFilter } from './CategoryFilter';
import { ColumnTextValues } from './FilterTypes';

type CategoryFilterGroupType = {
  column: ColumnModel;
  filterMap: any;
  handleChange: (value: ColumnTextValues) => void;
  originalValues: ColumnTextValues,
  table: string,
  values: ColumnTextValues,
};

function CategoryFilterGroup({
  column,
  filterMap,
  handleChange,
  originalValues,
  table,
  values,
}: CategoryFilterGroupType) {
  const [selected, setSelected] = useState<ColumnTextValues>({});

  useEffect(() => {
    // only update when filterMap is updated
    const updatedSelected = _.get(filterMap, 'value', {});
    setSelected(updatedSelected);
  }, []);

  type CheckBoxType = {
    value: any;
    name: string;
  }

  const handleCategoryChange = (box: CheckBoxType) => {
    const selectedClone: ColumnTextValues = _.clone(selected);
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
            handleChange={handleCategoryChange}
            name={name}
            count={count}
            table={table}
          />
        </div>
      );
    });

    return <div>{checkboxes}</div>;
  }

export default CategoryFilterGroup;
