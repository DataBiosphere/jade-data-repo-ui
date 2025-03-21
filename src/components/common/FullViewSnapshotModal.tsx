import { Box, Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { entries, isEmpty, now, uniq, without } from 'lodash';
import React, { Dispatch, useEffect } from 'react';
import { changePolicyUsersToSnapshotRequest, createSnapshot, snapshotCreateDetails } from 'actions';
import {
  BillingProfileModel,
  DatasetModel,
  SnapshotRequestContentsModelModeEnum,
  SnapshotRequestModelPolicies,
} from 'generated/tdr';
import { connect } from 'react-redux';
import { TdrState } from 'reducers';
import { Action } from 'redux';
import AuthDomain from 'components/snapshot/AuthDomain';
import { FullViewSnapshotDetails } from 'components/common/FullViewSnapshotModal/FullViewSnapshotDetails';
import { FullViewSnapshotModalSteps } from 'components/common/FullViewSnapshotModal/constants';
import { CreateModalSteps } from 'components/common/FullViewSnapshotModal/CreateModalSteps';
import ManagedSnapshotAccess, {
  transformRoleToCreatePolicy,
} from 'components/snapshot/ManagedSnapshotAccess';

interface FullViewSnapshotModalProps {
  readonly modalOpen: boolean;
  readonly onDismiss: () => void;
  readonly dataset: DatasetModel;
  readonly dispatch: Dispatch<Action>;
  readonly billingProfiles: Array<BillingProfileModel>;
}

function FullViewSnapshotModal(props: FullViewSnapshotModalProps) {
  const { billingProfiles, dataset, dispatch, modalOpen, onDismiss } = props;
  const [step, setStep] = React.useState(FullViewSnapshotModalSteps.DETAILS);

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
  const [policies, setPolicies] = React.useState<SnapshotRequestModelPolicies>({
    stewards: [],
    readers: [],
    aggregateDataReaders: [],
    discoverers: [],
  });

  useEffect(() => {
    const defaultBillingProfile = billingProfiles.find(
      (billingProfile: BillingProfileModel) => billingProfile.id === dataset.defaultProfileId,
    );
    setSelectedBillingProfile(defaultBillingProfile || billingProfiles[0]);
  }, [billingProfiles, setSelectedBillingProfile, dataset]);

  useEffect(() => {
    if (modalOpen) {
      setStep(FullViewSnapshotModalSteps.DETAILS);
      setSnapshotName(`Full_View_Snapshot_of_${dataset.name}_${now()}`);
      setSnapshotDescription(
        `Full View Snapshot of Dataset with Dataset name ${dataset.name}, and Dataset id ${dataset.id}.`,
      );
    }
  }, [modalOpen, dataset, setStep, setSnapshotName, setSnapshotDescription]);

  const finalStep = step === FullViewSnapshotModalSteps.SECURITY;

  const handleCreateFullViewSnapshot = () => {
    entries(policies).forEach(([role, emails]) => {
      const uniqEmails = uniq(emails);
      dispatch(changePolicyUsersToSnapshotRequest(role, uniqEmails));
    });

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

  const addUsers = (role: string, usersToAdd: string[]) => {
    const roleName = transformRoleToCreatePolicy(role);
    setPolicies((prevPolicies) => ({
      ...prevPolicies,
      [roleName]: [
        // @ts-ignore because the role is generated programmatically, it struggles with type safety
        ...prevPolicies[roleName],
        ...usersToAdd,
      ],
    }));
  };

  const removeUser = (role: string) => (user: string) => {
    const roleName = transformRoleToCreatePolicy(role);
    // @ts-ignore because the role is generated programmatically, it struggles with type safety
    setPolicies((prevPolicies) => ({
      ...prevPolicies,
      [roleName]: without(
        // @ts-ignore
        prevPolicies[roleName],
        user,
      ),
    }));
  };

  const renderModalDetails = () => {
    switch (step) {
      case FullViewSnapshotModalSteps.DETAILS: {
        return (
          <FullViewSnapshotDetails
            snapshotName={snapshotName}
            setSnapshotName={setSnapshotName}
            snapshotDescription={snapshotDescription}
            setSnapshotDescription={setSnapshotDescription}
            selectedBillingProfile={selectedBillingProfile}
            setSelectedBillingProfile={setSelectedBillingProfile}
            billingProfiles={billingProfiles}
          />
        );
      }
      case FullViewSnapshotModalSteps.SHARING: {
        return (
          <ManagedSnapshotAccess
            createMode={true}
            requestPolicies={policies}
            addUsers={addUsers}
            removeUser={removeUser}
          />
        );
      }
      default: {
        return <AuthDomain setParentAuthDomain={setSelectedAuthDomain} />;
      }
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onDismiss} open={modalOpen} sx={{ height: '700px' }}>
      <DialogTitle id="customized-dialog-title" sx={{ fontSize: '1rem' }}>
        Creating snapshot
      </DialogTitle>
      <Box sx={{ padding: '0px 24px 16px 24px' }}>
        <CreateModalSteps step={step} onStepChange={(newStep) => setStep(newStep)} />
        <Box sx={{ paddingY: '8px', height: '400px', overflowY: 'scroll' }}>
          {renderModalDetails()}
        </Box>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onDismiss} variant="text">
            Cancel
          </Button>
          <Box>
            {step > 0 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outlined"
                sx={{ marginRight: '8px' }}
              >
                Previous
              </Button>
            )}
            <Button
              onClick={finalStep ? onSelect : () => setStep(step + 1)}
              disabled={
                selectedBillingProfile?.id === undefined ||
                isEmpty(snapshotName) ||
                isEmpty(snapshotDescription)
              }
              variant="contained"
              data-cy="next-step-button"
            >
              {finalStep ? 'Create Snapshot' : 'Next'}
            </Button>
          </Box>
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
