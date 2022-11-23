import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { WithStyles, withStyles } from '@mui/styles';
import { Typography, CustomTheme, Button, IconButton } from '@mui/material';
import { AddCircleRounded, ExpandCircleDownRounded } from '@mui/icons-material';
import { TdrState } from 'reducers';
import { useFormContext } from 'react-hook-form';

const styles = (theme: CustomTheme) => ({
  contentContainer: {
    marginTop: '1rem',
    maxWidth: 1000,
  },
  schemaSectionHeader: {
    marginTop: 40,
    paddingBottom: 5,
    borderBottom: `2px solid ${theme.palette.terra.green}`,
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.5rem',
  },
  schemaSectionHeaderDesc: {
    marginLeft: 10,
  },
  schemaBuilderView: {
    backgroundColor: theme.palette.primary.focus,
    padding: 20,
    marginTop: 20,
    borderRadius: theme.shape.borderRadius,
  },
  schemaBuilderControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  schemaControlButton: {
    'text-transform': 'none',
    padding: '10px 14px 10px 11px',
    marginRight: 15
  },
  iconInButton: {
    marginRight: 6,
  },
  iconAsButton: {
    fontSize: '2.6rem',
    background: 'radial-gradient(red, blue)',
  },
});

interface IProps extends WithStyles<typeof styles> {
  userEmail: string;
}

const DatasetSchemaBuilderView = withStyles(styles)(({ classes }: IProps) => {
  const { getValues } = useFormContext();
  const [selectedTable, setSelectedTable] = useState('');

  return (
    <div className={classes.contentContainer}>
      <div>
        <Typography variant="h3">Build a schema</Typography>
        Every dataset in the Terra Data Repo must declare a schema for its tabular data. The schema
        describes what tables will be present in the dataset, and what data categories (i.e., what
        columns) will be present in each column, as well as any relationships between those columns.
      </div>

      <div className={classes.schemaSectionHeader}>
        <Typography variant="h3">Schema for:</Typography>
        <div className={classes.schemaSectionHeaderDesc}>{ getValues('name') }</div>
      </div>

      <div className={classes.schemaBuilderView}>
        <Typography variant="h4">Schema</Typography>
        <div className={classes.schemaBuilderControls}>
          <div>
            <Button
              color="primary"
              disableElevation
              variant="contained"
              type="button"
              className={classes.schemaControlButton}
            >
              <AddCircleRounded className={classes.iconInButton} />
              Create a table
            </Button>

            <Button
              color="primary"
              disableElevation
              variant="contained"
              type="button"
              disabled
              className={classes.schemaControlButton}
            >
              <AddCircleRounded className={classes.iconInButton} />
              Create a column
            </Button>
          </div>

          <div>
            <IconButton
              size="small"
              // color="primary"
              onClick={() => {
                console.log('hello');
              }}
            >
              <ExpandCircleDownRounded color="primary" className={classes.iconAsButton} />
            </IconButton>

            <IconButton
              size="small"
              // color="primary"
              onClick={() => {
                console.log('hello');
              }}
            >
              <ExpandCircleDownRounded color="primary" className={classes.iconAsButton} />
            </IconButton>
          </div>
        </div>
      </div>

      { selectedTable }
    </div>
  );
});

function mapStateToProps(state: TdrState) {
  return {
    userEmail: state.user.email,
  };
}

export default connect(mapStateToProps)(DatasetSchemaBuilderView);
