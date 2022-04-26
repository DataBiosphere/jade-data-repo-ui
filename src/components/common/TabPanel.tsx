import React from 'react';
import { createStyles, ClassNameMap, withStyles } from '@mui/styles';

const styles = () =>
  createStyles({
    tabPanel: {
      padding: '1em 1em 1em 28px',
    },
  });

type TabPanelProps = {
  children: React.ReactNode;
  classes: ClassNameMap;
  index: number;
  value: number;
};

function TabPanel(props: TabPanelProps) {
  const { classes, children, value, index } = props;
  return (
    <div
      className={classes.tabPanel}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

export default withStyles(styles)(TabPanel);
