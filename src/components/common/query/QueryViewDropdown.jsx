import React, { useState } from 'react';
import PropTypes from 'prop-types';
import JadeDropdown from '../../dataset/query/JadeDropdown';

function QueryViewDropdown({ onSelectedItem, options }) {
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

QueryViewDropdown.propTypes = {
  onSelectedItem: PropTypes.func,
  options: PropTypes.array,
};

export default QueryViewDropdown;
