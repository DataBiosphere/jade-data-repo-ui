import React from 'react';
import PropTypes from 'prop-types';
import { Button, Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { TreeItem, TreeView } from '@material-ui/lab';
import { AddBoxOutlined, IndeterminateCheckBoxOutlined } from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
  root: {
    height: '100%',
    padding: '15px',
  },
  headerText: {
    fontWeight: theme.typography.bold,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    padding: '6px 0px',
  },
  viewDatasetButton: {
    width: '100%',
    marginBottom: '12px',
  },
});

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 5,
    borderLeft: `2px dashed ${fade(theme.palette.primary.main, 0.5)}`,
  },
  label: {
    marginTop: '4px',
    marginBottom: '4px',
  },
}))((props) => <TreeItem {...props} />);

export class DatasetOverviewSchemaPanel extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
  };

  datasetTables = (dataset) => (
    <TreeView
      aria-label="dataset schema navigator"
      defaultCollapseIcon={<IndeterminateCheckBoxOutlined color="primary" />}
      defaultExpandIcon={<AddBoxOutlined color="primary" />}
      defaultExpanded={['0']}
    >
      {dataset.schema.tables.map((table, i) => (
        <StyledTreeItem
          key={`${i}`}
          nodeId={`${i}`}
          label={<Typography variant="h6">{table.name}</Typography>}
        >
          {table.columns.map((column, j) => (
            <StyledTreeItem key={`${i}${j}`} nodeId={`${i}${j}`} label={column.name} />
          ))}
        </StyledTreeItem>
      ))}
    </TreeView>
  );

  render() {
    const { classes, dataset } = this.props;
    return (
      <Paper className={classes.root} elevation={4}>
        <Link to="query">
          <Button
            className={classes.viewDatasetButton}
            color="primary"
            variant="outlined"
            disableElevation
          >
            View Dataset
          </Button>
        </Link>

        <Typography className={classes.sectionHeader} variant="h5">
          Dataset Schema
        </Typography>
        <div>
          <Typography className={classes.sectionHeader} variant="h5" style={{ float: 'left' }}>
            Tables
          </Typography>
          <Typography style={{ float: 'left', padding: '6px 0px' }}>
            ({dataset.schema.tables.length})
          </Typography>
        </div>
        {this.datasetTables(dataset)}
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetOverviewSchemaPanel));
