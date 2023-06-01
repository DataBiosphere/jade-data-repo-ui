import React from 'react';
import { TextField, Input } from '@mui/material';

type RangeInputType = {
  handleChange: (value: any) => void;
  handleFilters: () => void;
  value: string;
};

function RangeInput({ handleChange, handleFilters, value }: RangeInputType) {
  const handleReturn = (event: any) => {
    if (event.key === 'Enter') {
      handleFilters();
    }
  };

  return (
    <TextField
      onChange={handleChange}
      variant="outlined"
      margin="dense"
      value={value || ''}
      onKeyPress={handleReturn}
    >
      <Input readOnly={false} />
    </TextField>
  );
}

export default RangeInput;
