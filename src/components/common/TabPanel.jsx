import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@mui/styles';

const styles = () => ({
  tabPanel: {
    padding: '1em 1em 1em 28px',
  },
});

function TabPanel(props) {
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

TabPanel.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default withStyles(styles)(TabPanel);
