import {
  createSnapshot,
  getBillingProfiles,
  getUserGroups,
  snapshotCreateDetails,
} from 'actions/index';
import { TdrState } from 'reducers';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
  FormLabel,
  Link,
  TextField,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { Dispatch } from 'react';
import {
  BillingProfileModel,
  DatasetModel,
  SnapshotRequestContentsModelModeEnum,
} from 'generated/tdr';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { isEmpty, now, uniq } from 'lodash';
import { ManagedGroupMembershipEntry } from 'models/group';
import TerraTooltip from './TerraTooltip';
import JadeDropdown from '../dataset/data/JadeDropdown';
import { useOnMount } from '../../libs/utils';

const StyledLink = styled('span')(({ theme }) => ({
  // @ts-ignore
  ...theme.mixins.jadeLink,
}));

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
  userGroups,
}: Readonly<FullViewSnapshotButtonProps>) {
  useOnMount(() => {
    dispatch(getBillingProfiles());
    dispatch(getUserGroups());
  });

  const defaultBillingProfile = billingProfiles.find(
    (billingProfile) => billingProfile.id === dataset.defaultProfileId,
  );

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedBillingProfile, setSelectedBillingProfile] = React.useState(defaultBillingProfile);
  const [selectedAuthDomain, setSelectedAuthDomain] = React.useState<string | undefined>(undefined);
  const [snapshotName, setSnapshotName] = React.useState(
    `Full_View_Snapshot_of_${dataset.name}_${now()}`,
  );
  const [snapshotDescription, setSnapshotDescription] = React.useState(
    `Full View Snapshot of Dataset with Dataset name ${dataset.name}, and Dataset id ${dataset.id}.`,
  );

  // if the default billing profile is undefined or the user does not have permission on it, disable button and show tooltip
  const isDisabled = billingProfiles.length === 0;
  let tooltipText = '';
  if (isDisabled) {
    tooltipText = 'You do not have access to any billing profiles to create a snapshot';
  }

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
          <FormLabel
            sx={{ fontWeight: 600, color: 'black' }}
            htmlFor="snapshot-description"
            required
          >
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
            <FormLabel
              sx={{ fontWeight: 600, color: 'black' }}
              htmlFor="authorization-domain-select"
            >
              Authorization Domain
              <Box component="span" sx={{ fontWeight: 400, color: 'black' }}>
                {' '}
                - (optional)
              </Box>
            </FormLabel>
          </Box>
          <JadeDropdown
            sx={{ height: '2.5rem' }}
            disabled={userGroups ? userGroups.length <= 1 : true}
            options={userGroups ? userGroups.map((group) => group.groupName) : []}
            name="authorization-domain"
            onSelectedItem={(event) => setSelectedAuthDomain(event.target.value)}
            value={selectedAuthDomain || ''}
          />
          <Box>
            Authorization Domains restrict data access to only specified individuals in a group and
            are intended to fulfill requirements you may have for data governed by a compliance
            standard, such as federal controlled-access data or HIPAA protected data. They follow
            all snapshot copies and cannot be removed. For more details, see{' '}
            <Link
              href="https://support.terra.bio/hc/en-us/articles/360026775691-Overview-Managing-access-to-controlled-data-with-Authorization-Domains#h_01J94P49XS1NE5KE4B3NA3A413"
              target="_blank"
            >
              <StyledLink>When to use an Authorization Domain</StyledLink>
            </Link>
            .
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
