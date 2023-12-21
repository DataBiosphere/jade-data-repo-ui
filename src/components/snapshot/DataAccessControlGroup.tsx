import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Typography, Grid } from '@mui/material';
import { TdrState } from '../../reducers';
import UserList from '../UserList';

type DataAccessControlGroupProps = {
  authDomains: Array<string>;
};

function DataAccessControlGroup(props: DataAccessControlGroupProps) {
  const { authDomains } = props;
  return (
    <Grid container spacing={1} data-cy="data-access-control-container">
      <Typography variant="h6">Data Access Control Groups</Typography>
      <Grid item xs={12} data-cy="data-access-controls">
        <UserList canManageUsers={false} typeOfUsers="Data Access Controls" users={authDomains} />
      </Grid>
    </Grid>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    authDomains: state.snapshots.snapshotAuthDomains,
  };
}

export default connect(mapStateToProps)(DataAccessControlGroup);
