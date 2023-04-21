import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import CategoryFilter from './CategoryFilter';
import { ColumnTextValues, CheckBoxType } from './FilterTypes';

type CategoryFilterGroupType = {
  filterMap: any;
  handleChange: (value: ColumnTextValues) => void;
  originalValues: ColumnTextValues;
  values: ColumnTextValues;
};

function CategoryFilterGroup({
  filterMap,
  handleChange,
  originalValues,
  values,
}: CategoryFilterGroupType) {
  const [selected, setSelected] = useState<ColumnTextValues>({});

  useEffect(() => {
    // only update when filterMap is updated
    const updatedSelected = _.get(filterMap, 'value', {});
    setSelected(updatedSelected);
    // TODO - will fix by moving this to redux
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          filterMap={filterMap}
          handleChange={handleCategoryChange}
          name={name}
          count={count}
        />
      </div>
    );
  });

  return <div>{checkboxes}</div>;
}

export default CategoryFilterGroup;
