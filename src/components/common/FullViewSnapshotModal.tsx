import {
  Box,
  Button,
  CustomTheme,
  Dialog,
  DialogActions,
  DialogTitle,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';
import JadeDropdown from 'components/dataset/data/JadeDropdown';
import { isEmpty, now, uniq } from 'lodash';
import React, { Dispatch, useEffect } from 'react';
import { createSnapshot, snapshotCreateDetails } from 'actions';
import {
  BillingProfileModel,
  DatasetModel,
  SnapshotRequestContentsModelModeEnum,
} from 'generated/tdr';
import { connect } from 'react-redux';
import { TdrState } from 'reducers';
import { Action } from 'redux';
import AuthDomain from 'components/snapshot/AuthDomain';

interface FullViewSnapshotModalProps {
  readonly modalOpen: boolean;
  readonly onDismiss: () => void;
  readonly dataset: DatasetModel;
  readonly dispatch: Dispatch<Action>;
  readonly billingProfiles: Array<BillingProfileModel>;
}

function FullViewSnapshotModal(props: FullViewSnapshotModalProps) {
  const { billingProfiles, dataset, dispatch, modalOpen, onDismiss } = props;

  const [selectedAuthDomain, setSelectedAuthDomain] = React.useState<string | undefined>(undefined);
  const [snapshotName, setSnapshotName] = React.useState(
    `Full_View_Snapshot_of_${dataset.name}_${now()}`,
  );
  const [selectedBillingProfile, setSelectedBillingProfile] = React.useState<
    BillingProfileModel | undefined
  >();
  const [snapshotDescription, setSnapshotDescription] = React.useState(
    `Full View Snapshot of Dataset with Dataset name ${dataset.name}, and Dataset id ${dataset.id}.`,
  );

  useEffect(() => {
    const defaultBillingProfile = billingProfiles.find(
      (billingProfile: BillingProfileModel) => billingProfile.id === dataset.defaultProfileId,
    );
    setSelectedBillingProfile(defaultBillingProfile || billingProfiles[0]);
  }, [billingProfiles, setSelectedBillingProfile, dataset]);

  const handleCreateFullViewSnapshot = () => {
    dispatch(
      snapshotCreateDetails({
        name: snapshotName,
        description: snapshotDescription,
        mode: SnapshotRequestContentsModelModeEnum.ByFullView,
        dataset,
        authDomain: selectedAuthDomain,
        billingProfileId: selectedBillingProfile?.id,
      }),
    );
    dispatch(createSnapshot());
  };

  const onSelect = () => {
    handleCreateFullViewSnapshot();
    onDismiss();
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onDismiss} open={modalOpen}>
      <DialogTitle id="customized-dialog-title" sx={{ fontSize: '1rem' }}>
        Creating snapshot - select a billing project
      </DialogTitle>
      <Box sx={{ padding: '0px 24px 16px 24px' }}>
        <FormLabel sx={{ fontWeight: 600, color: 'black' }} htmlFor="snapshot-name" required>
          Snapshot Name
        </FormLabel>
        <TextField
          fullWidth
          margin="normal"
          id="snapshot-name"
          label="Snapshot Name"
          value={snapshotName}
          onChange={(e) => setSnapshotName(e.target.value)}
        />
        <FormLabel sx={{ fontWeight: 600, color: 'black' }} htmlFor="snapshot-description" required>
          Snapshot Description
        </FormLabel>
        <TextField
          fullWidth
          margin="normal"
          id="snapshot-description"
          label="Snapshot Description"
          value={snapshotDescription}
          onChange={(e) => setSnapshotDescription(e.target.value)}
        />
        <Typography sx={{ color: 'black' }}>
          Do you want to use the Google Billing Project associated with this dataset or would you
          like to select a different one?
        </Typography>
        <Box sx={{ marginTop: '8px' }}>
          <FormLabel
            sx={{ fontWeight: 600, color: 'black' }}
            htmlFor="billing-profile-select"
            required
          >
            Google Billing Project
          </FormLabel>
        </Box>
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
        <Box sx={{ marginTop: '8px' }}>
          <AuthDomain setParentAuthDomain={setSelectedAuthDomain} />
        </Box>
        <DialogActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onDismiss} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={onSelect}
            disabled={
              selectedBillingProfile?.id === undefined ||
              isEmpty(snapshotName) ||
              isEmpty(snapshotDescription)
            }
            variant="contained"
            data-cy="select-billing-profile-button"
          >
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    billingProfiles: state.profiles.profiles,
    snapshot: state.snapshots.snapshot,
    userGroups: state.user.userGroups,
  };
}

export default connect(mapStateToProps)(FullViewSnapshotModal);
