import React from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'lodash';
import { Typography } from '@mui/material';
import JadeDropdown from '../../JadeDropdown';

function BillingProfileDropdown({
  billingProfiles,
  selectedBillingProfile,
  onSelectedItem,
  disabled = false,
  sx = { height: '2.5rem', marginTop: '8px' },
  showLabel = true,
  labelProps = { variant: 'subtitle2', marginTop: 1 },
}) {
  const handleItemSelection = (event) => {
    const selectedProfile = billingProfiles.find(
      (billingProfile) => billingProfile.profileName === event.target.value,
    );
    onSelectedItem(selectedProfile);
  };

  const profileOptions = uniq(
    billingProfiles
      .filter((billingProfile) => billingProfile.profileName !== undefined)
      .map((billingProfile) => billingProfile.profileName),
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
        data-cy="selectBillingProfile"
      />
    </>
  );
}

BillingProfileDropdown.propTypes = {
  billingProfiles: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  labelProps: PropTypes.object,
  onSelectedItem: PropTypes.func.isRequired,
  selectedBillingProfile: PropTypes.object,
  showLabel: PropTypes.bool,
  sx: PropTypes.object,
};

export default BillingProfileDropdown;
