import React from 'react';
import { Box } from '@mui/material';

type TabPanelProps = {
  children: React.ReactNode;
  index: number;
  value: number;
};

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box
      sx={{ padding: '1em 1em 1em 28px' }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

export default TabPanel;
