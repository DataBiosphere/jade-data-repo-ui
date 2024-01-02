import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ClassNameMap, withStyles } from '@mui/styles';
import { Typography, Grid, CustomTheme } from '@mui/material';
import { TdrState } from '../../reducers';
import UserList from '../UserList';

const styles = (theme: CustomTheme) => ({
  terraLink: {
    color: theme.palette.primary.main,
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(2),
    textDecoration: 'none',
  },
});

type DataAccessControlGroupProps = {
  classes: ClassNameMap;
  authDomains: Array<string>;
  terraUrl: string | undefined;
};

function DataAccessControlGroup({ classes, authDomains, terraUrl }: DataAccessControlGroupProps) {
  return (
    <Grid container spacing={1} data-cy="data-access-control-container">
      <Typography variant="h6">Data Access Control Groups</Typography>
      <Grid item xs={12} data-cy="data-access-control-description">
        <Typography variant="body1">
          Collaborators must be a member of all of these{' '}
          { _.isUndefined(terraUrl) ? (
            'groups'
          ) : (
            <a href={`${terraUrl}/#groups`} target="_blank" rel="noopener noreferrer">
              <span className={classes.terraLink}>groups</span>
            </a>
          )}{' '}
          to access this snapshot.
        </Typography>
      </Grid>
      <Grid item xs={12} data-cy="data-access-controls">
        <UserList canManageUsers={false} typeOfUsers="Data Access Controls" users={authDomains} />
      </Grid>
    </Grid>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    authDomains: state.snapshots.snapshotAuthDomains,
    terraUrl: state.configuration.configObject.terraUrl,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DataAccessControlGroup));
