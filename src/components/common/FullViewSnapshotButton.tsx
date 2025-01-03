import { createSnapshot, getBillingProfiles, snapshotCreateDetails } from 'actions/index';
import { TdrState } from 'reducers';
import TerraTooltip from 'components/common/TerraTooltip';
import { Button } from '@mui/material';
import React, { Dispatch } from 'react';
import {
  BillingProfileModel,
  DatasetModel,
  SnapshotRequestContentsModelModeEnum,
} from 'generated/tdr';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { now } from 'lodash';
import { useOnMount } from '../../libs/utils';

interface FullViewSnapshotButtonProps {
  dispatch: Dispatch<Action>;
  dataset: DatasetModel;
  billingProfiles: Array<BillingProfileModel>;
}

function FullViewSnapshotButton({
  dataset,
  dispatch,
  billingProfiles,
}: Readonly<FullViewSnapshotButtonProps>) {
  useOnMount(() => {
    dispatch(getBillingProfiles());
  });

  const defaultBillingProfile = dataset.defaultProfileId;
  // if the default billing profile is undefined or the user does not have permission on it, disable button and show tooltip
  const hasAccess = billingProfiles.some((model) => model.id === defaultBillingProfile);
  let tooltipText = '';
  if (!defaultBillingProfile) {
    tooltipText = 'There is no default billing profile associated with this dataset.';
  } else if (!hasAccess) {
    tooltipText = 'You do not have access to the billing profile associated with this dataset.';
  }
  const isDisabled = !defaultBillingProfile || !hasAccess;

  const handleCreateFullViewSnapshot = () => {
    const name = `Full_View_Snapshot_of_${dataset.name}_${now()}`;
    const description = `Full-View Snapshot of Dataset with Dataset name ${dataset.name}, and Dataset id ${dataset.id}.`;
    dispatch(
      snapshotCreateDetails(
        name,
        description,
        SnapshotRequestContentsModelModeEnum.ByFullView,
        dataset,
      ),
    );
    dispatch(createSnapshot());
  };

  return (
    <TerraTooltip title={isDisabled ? tooltipText : ''}>
      <span>
        <Button
          variant="outlined"
          disableElevation
          onClick={() => handleCreateFullViewSnapshot()}
          disabled={isDisabled}
        >
          Create Full-View Snapshot
        </Button>
      </span>
    </TerraTooltip>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    billingProfiles: state.profiles.profiles,
    snapshot: state.snapshots.snapshot,
  };
}

export default connect(mapStateToProps)(FullViewSnapshotButton);
