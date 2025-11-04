import React from 'react';
import { uniq } from 'lodash';
import { Typography, TypographyProps, SelectChangeEvent } from '@mui/material';
import JadeDropdown from '../../JadeDropdown';

export interface BillingProfile {
  id?: string;
  profileName?: string;
  [key: string]: any;
}

export interface BillingProfileDropdownProps {
  readonly billingProfiles: BillingProfile[];
  readonly selectedBillingProfile?: BillingProfile | null;
  readonly onSelectedItem: (selectedProfile: BillingProfile | undefined) => void;
  readonly disabled?: boolean;
  readonly sx?: React.CSSProperties;
  readonly showLabel?: boolean;
  readonly labelProps?: TypographyProps;
}

function BillingProfileDropdown({
  billingProfiles,
  selectedBillingProfile,
  onSelectedItem,
  disabled = false,
  sx = { height: '2.5rem', marginTop: '8px' },
  showLabel = true,
  labelProps = { variant: 'subtitle2', marginTop: 1 },
}: BillingProfileDropdownProps) {
  const handleItemSelection = (event: SelectChangeEvent) => {
    const selectedProfile = billingProfiles.find(
      (billingProfile) => billingProfile.profileName === event.target.value,
    );
    onSelectedItem(selectedProfile);
  };

  const profileOptions = uniq(
    billingProfiles
      .filter((billingProfile) => billingProfile.profileName !== undefined)
      .map((billingProfile) => billingProfile.profileName as string),
  );

  return (
    <>
      {showLabel && <Typography {...labelProps}>Billing Profile</Typography>}
      <JadeDropdown
        sx={sx}
        disabled={disabled || billingProfiles.length <= 1}
        options={profileOptions}
        name="billing-profile"
        onSelectedItem={handleItemSelection}
        value={selectedBillingProfile?.profileName || ''}
      />
    </>
  );
}

export default BillingProfileDropdown;
