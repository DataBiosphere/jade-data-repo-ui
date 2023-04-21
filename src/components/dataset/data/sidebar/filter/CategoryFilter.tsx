import React from 'react';
import _ from 'lodash';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { CheckBoxType } from './FilterTypes';

type CategoryFilterType = {
  count: number;
  filterMap: any;
  handleChange: (value: CheckBoxType) => void;
  name: string;
};

function CategoryFilter({ count, filterMap, handleChange, name }: CategoryFilterType) {
  const handleCategoryChange = (event: any) => {
    const checkBoxVal: CheckBoxType = {
      name,
      value: event.target.checked,
    };
    handleChange(checkBoxVal);
  };
  const checked = _.get(filterMap, ['value', name], false);
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={handleCategoryChange}
          value={name}
          color="primary"
          size="small"
          data-cy={`categoryFilterCheckbox-${name}`}
        />
      }
      label={`${name} (${count})`}
    />
  );
}

export default CategoryFilter;
