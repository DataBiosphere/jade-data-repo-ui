import { createSnapshot, getBillingProfiles, snapshotCreateDetails } from 'actions/index';
import { TdrState } from 'reducers';
import { Button, Dialog, DialogActions, DialogTitle, Typography, FormLabel } from '@mui/material';
import React, { Dispatch } from 'react';
import {
  BillingProfileModel,
  DatasetModel,
  SnapshotRequestContentsModelModeEnum,
} from 'generated/tdr';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { now, uniq } from 'lodash';
import TerraTooltip from './TerraTooltip';
import JadeDropdown from '../dataset/data/JadeDropdown';
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

  const defaultBillingProfile = billingProfiles.find(
    (billingProfile) => billingProfile.id === dataset.defaultProfileId,
  );

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedBillingProfile, setSelectedBillingProfile] = React.useState(defaultBillingProfile);

  // if the default billing profile is undefined or the user does not have permission on it, disable button and show tooltip
  const isDisabled = billingProfiles.length === 0;
  let tooltipText = '';
  if (isDisabled) {
    tooltipText = 'You do not have access to any billing profiles to create a snapshot';
  }

  const handleCreateFullViewSnapshot = () => {
    const name = `Full_View_Snapshot_of_${dataset.name}_${now()}`;
    const description = `Full View Snapshot of Dataset with Dataset name ${dataset.name}, and Dataset id ${dataset.id}.`;
    dispatch(
      snapshotCreateDetails(
        name,
        description,
        SnapshotRequestContentsModelModeEnum.ByFullView,
        dataset,
      ),
    );
    dispatch(createSnapshot(selectedBillingProfile?.id));
  };

  const onDismiss = () => setModalOpen(false);

  const onSelect = () => {
    handleCreateFullViewSnapshot();
    setModalOpen(false);
  };

  return (
    <>
      <TerraTooltip title={isDisabled ? tooltipText : ''}>
        <span>
          <Button
            variant="outlined"
            disableElevation
            onClick={() => {
              setSelectedBillingProfile(defaultBillingProfile || billingProfiles[0]);
              setModalOpen(true);
            }}
            disabled={isDisabled}
          >
            Create Full View Snapshot
          </Button>
        </span>
      </TerraTooltip>
      <Dialog fullWidth maxWidth="sm" onClose={onDismiss} open={modalOpen}>
        <DialogTitle id="customized-dialog-title" sx={{ fontSize: '1rem' }}>
          Creating snapshot - select a billing project
        </DialogTitle>
        <div style={{ padding: '0px 24px 16px 24px' }}>
          <Typography sx={{ color: 'black' }}>
            Do you want to use the Google Billing Project associated with this dataset or would you
            like to select a different one?
          </Typography>
          <div style={{ marginTop: 8 }}>
            <FormLabel
              sx={{ fontWeight: 600, color: 'black' }}
              htmlFor="billing-profile-select"
              required
            >
              Google Billing Project
            </FormLabel>
          </div>
          <JadeDropdown
            sx={{ height: '2.5rem' }}
            disabled={billingProfiles.length <= 1}
            options={uniq(
              billingProfiles
                .filter((billingProfile) => billingProfile.profileName !== undefined)
                .map((billingProfile) => billingProfile.profileName) as string[],
            )}
            name="billing-profile"
            onSelectedItem={(event) =>
              setSelectedBillingProfile(
                billingProfiles.find(
                  (billingProfile) => billingProfile.profileName === event.target.value,
                ),
              )
            }
            value={selectedBillingProfile?.profileName || ''}
          />
          <Typography>If this is the correct billing project - just click select</Typography>
          <DialogActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onDismiss} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={onSelect}
              disabled={selectedBillingProfile?.id === undefined}
              variant="contained"
              data-cy="select-billing-profile-button"
            >
              Select
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    billingProfiles: state.profiles.profiles,
    snapshot: state.snapshots.snapshot,
  };
}

export default connect(mapStateToProps)(FullViewSnapshotButton);
