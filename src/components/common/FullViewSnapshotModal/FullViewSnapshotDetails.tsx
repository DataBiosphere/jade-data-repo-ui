import { BillingProfileModel } from 'generated/tdr';
import { Box, FormLabel, TextField, Typography } from '@mui/material';
import JadeDropdown from 'components/dataset/data/JadeDropdown';
import { uniq } from 'lodash';
import React from 'react';

export interface FullViewSnapshotDetailsProps {
  snapshotName: string;
  setSnapshotName: (name: string) => void;
  snapshotDescription: string;
  setSnapshotDescription: (description: string) => void;
  selectedBillingProfile: BillingProfileModel | undefined;
  setSelectedBillingProfile: (profile: BillingProfileModel | undefined) => void;
  billingProfiles: Array<BillingProfileModel>;
}

export function FullViewSnapshotDetails(props: FullViewSnapshotDetailsProps) {
  const {
    snapshotName,
    setSnapshotName,
    snapshotDescription,
    setSnapshotDescription,
    selectedBillingProfile,
    setSelectedBillingProfile,
    billingProfiles,
  } = props;
  return (
    <>
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
        Do you want to use the Google Billing Project associated with this dataset or would you like
        to select a different one?
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
    </>
  );
}
