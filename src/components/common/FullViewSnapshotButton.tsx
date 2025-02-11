import {
  getBillingProfiles,
  getUserGroups,
} from 'actions/index';
import { TdrState } from 'reducers';
import { Button } from '@mui/material';
import React, { Dispatch } from 'react';
import { BillingProfileModel, DatasetModel } from 'generated/tdr';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { ManagedGroupMembershipEntry } from 'models/group';
import FullViewSnapshotModal from 'components/common/FullViewSnapshotModal';
import TerraTooltip from './TerraTooltip';
import { useOnMount } from '../../libs/utils';

interface FullViewSnapshotButtonProps {
  dispatch: Dispatch<Action>;
  dataset: DatasetModel;
  billingProfiles: Array<BillingProfileModel>;
  userGroups: Array<ManagedGroupMembershipEntry>;
}

function FullViewSnapshotButton({
  dataset,
  dispatch,
  billingProfiles,
}: Readonly<FullViewSnapshotButtonProps>) {
  useOnMount(() => {
    dispatch(getBillingProfiles());
    dispatch(getUserGroups());
  });

  const [modalOpen, setModalOpen] = React.useState(false);
  // if the default billing profile is undefined or the user does not have permission on it, disable button and show tooltip
  const isDisabled = billingProfiles.length === 0;
  let tooltipText = '';
  if (isDisabled) {
    tooltipText = 'You do not have access to any billing profiles to create a snapshot';
  }

  const onDismiss = () => setModalOpen(false);

  return (
    <>
      <TerraTooltip title={isDisabled ? tooltipText : ''}>
        <span>
          <Button
            variant="outlined"
            disableElevation
            onClick={() => {
              setModalOpen(true);
            }}
            disabled={isDisabled}
          >
            Create Full View Snapshot
          </Button>
        </span>
      </TerraTooltip>
      <FullViewSnapshotModal modalOpen={modalOpen} onDismiss={onDismiss} dataset={dataset} />
    </>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    billingProfiles: state.profiles.profiles,
    snapshot: state.snapshots.snapshot,
    userGroups: state.user.userGroups,
  };
}

export default connect(mapStateToProps)(FullViewSnapshotButton);
