import { BillingProfileModel } from 'generated/tdr';
import { FormLabel, TextField, Typography } from '@mui/material';
import BillingProfileDropdown from 'components/dataset/data/sidebar/panels/BillingProfileDropdown';
import React from 'react';

export interface FullViewSnapshotDetailsProps {
  readonly snapshotName: string;
  readonly setSnapshotName: (name: string) => void;
  readonly snapshotDescription: string;
  readonly setSnapshotDescription: (description: string) => void;
  readonly selectedBillingProfile: BillingProfileModel | undefined;
  readonly setSelectedBillingProfile: (profile: BillingProfileModel | undefined) => void;
  readonly billingProfiles: Array<BillingProfileModel>;
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
      <BillingProfileDropdown
        billingProfiles={billingProfiles}
        selectedBillingProfile={selectedBillingProfile}
        onSelectedItem={setSelectedBillingProfile}
        sx={{ height: '2.5rem', marginTop: '8px' }}
        labelProps={{ sx: { fontWeight: 600, color: 'black' } }}
      />
    </>
  );
}
