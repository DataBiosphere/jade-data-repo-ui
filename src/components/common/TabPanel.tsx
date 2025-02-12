import React from 'react';
import { Box } from '@mui/material';

type TabPanelProps = {
  readonly children: React.ReactNode;
  readonly index: number;
  readonly value: number;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
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
