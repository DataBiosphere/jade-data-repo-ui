import React, { useState } from 'react';
import PropTypes from 'prop-types';
import JadeDropdown from '../../dataset/data/JadeDropdown';

function DataViewDropdown({ onSelectedItem, options }) {
  const [table, setTable] = useState(options[0]);

  const handleChange = (event) => {
    setTable(event.target.value);
    onSelectedItem(event.target.value);
  };

  return (
    <JadeDropdown
      onSelectedItem={handleChange}
      options={options}
      value={table}
      name="Select Table"
    />
  );
}

DataViewDropdown.propTypes = {
  onSelectedItem: PropTypes.func,
  options: PropTypes.array,
};

export default DataViewDropdown;
