import { createFullViewSnapshot, getBillingProfiles } from 'actions/index';
import { TdrState } from 'reducers';
import TerraTooltip from 'components/common/TerraTooltip';
import { Button } from '@mui/material';
import React, { Dispatch } from 'react';
import { BillingProfileModel, DatasetModel } from 'generated/tdr';
import { ClassNameMap, WithStyles, withStyles } from '@mui/styles';
import { Action } from 'redux';
import { CustomTheme } from '@mui/material/styles';
import { connect } from 'react-redux';
import { useOnMount } from '../../libs/utils';

const styles = (theme: CustomTheme) => ({
  button: {
    margin: theme.spacing(2),
  },
  buttonContainer: {},
});

interface FullViewSnapshotButtonProps extends WithStyles<typeof styles> {
  classes: ClassNameMap;
  dispatch: Dispatch<Action>;
  dataset: DatasetModel;
  billingProfiles: Array<BillingProfileModel>;
}

const FullViewSnapshotButton = withStyles(styles)(
  ({ classes, dataset, dispatch, billingProfiles }: FullViewSnapshotButtonProps) => {
    useOnMount(() => {
      dispatch(getBillingProfiles());
    });

    const defaultBillingProfile = dataset.defaultProfileId;
    // if user does not have permission on billing profile, disable button and show tooltip
    const isDisabled = !billingProfiles.map((model) => model.id).includes(defaultBillingProfile);
    const tooltipText =
      'You do not have access to the billing profile associated with this dataset.';

    return (
      <TerraTooltip title={isDisabled ? tooltipText : ''}>
        <span className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="outlined"
            disableElevation
            onClick={() => dispatch(createFullViewSnapshot())}
            disabled={isDisabled}
          >
            Create Full-View Snapshot
          </Button>
        </span>
      </TerraTooltip>
    );
  },
);

function mapStateToProps(state: TdrState) {
  return {
    billingProfiles: state.profiles.profiles,
  };
}

export default connect(mapStateToProps)(FullViewSnapshotButton);
