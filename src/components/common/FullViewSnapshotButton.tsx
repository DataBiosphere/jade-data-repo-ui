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
}: FullViewSnapshotButtonProps) {
  useOnMount(() => {
    dispatch(getBillingProfiles());
  });

  const defaultBillingProfile = dataset.defaultProfileId;
  // if user does not have permission on billing profile, disable button and show tooltip
  const isDisabled = !billingProfiles.map((model) => model.id).includes(defaultBillingProfile);
  const tooltipText = 'You do not have access to the billing profile associated with this dataset.';

  const handleCreateFullViewSnapshot = () => {
    const name = `Full_View_Snapshot_of_${dataset.name}_${now()}`;
    const description = `Full-View Snapshot of Dataset with Dataset name ${dataset.name}, and Dataset id ${dataset.id}.`;
    dispatch(
      snapshotCreateDetails(
        name,
        description,
        SnapshotRequestContentsModelModeEnum.ByFullView,
        null,
        null,
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
