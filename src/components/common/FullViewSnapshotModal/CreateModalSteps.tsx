import { FullViewSnapshotModalSteps } from 'components/common/FullViewSnapshotModal/constants';
import React from 'react';
import { Box, Button, LinearProgress, useTheme } from '@mui/material';
import { styled, CustomTheme } from '@mui/material/styles';

const StyledLinearProgress = styled(LinearProgress)(({ theme }: { theme: CustomTheme }) => ({
  height: '10px',
  borderRadius: '5px',
  '&.MuiLinearProgress-colorPrimary': {
    backgroundColor: theme.palette.primary.light,
  },
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.terra.green,
  },
}));

interface StepProps {
  readonly step: FullViewSnapshotModalSteps;
  readonly activeStep: FullViewSnapshotModalSteps;
  readonly children: React.ReactNode;
  readonly onStepChange: (step: FullViewSnapshotModalSteps) => void;
}

function Step(props: StepProps) {
  const { step, activeStep, children, onStepChange } = props;
  return (
    <Button
      sx={{
        width: '33%',
        textTransform: 'none',
        alignItems: 'flex-start',
        fontWeight: activeStep === step ? 600 : 400,
        display: 'flex',
        padding: '0 0.5rem',
      }}
      onClick={() => onStepChange(step)}
    >
      <Box>{step + 1}.</Box>
      <Box>{children}</Box>
    </Button>
  );
}

export interface CreateModalStepsProps {
  readonly step: FullViewSnapshotModalSteps;
  readonly onStepChange: (step: FullViewSnapshotModalSteps) => void;
}

export function CreateModalSteps(props: CreateModalStepsProps) {
  const { step, onStepChange } = props;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Step
          step={FullViewSnapshotModalSteps.DETAILS}
          activeStep={step}
          onStepChange={onStepChange}
        >
          Basic Information and Billing
        </Step>
        <Step
          step={FullViewSnapshotModalSteps.SHARING}
          activeStep={step}
          onStepChange={onStepChange}
        >
          Sharing
        </Step>
        <Step
          step={FullViewSnapshotModalSteps.SECURITY}
          activeStep={step}
          onStepChange={onStepChange}
        >
          Additional Security Options
        </Step>
      </Box>
      <StyledLinearProgress
        variant="determinate"
        value={(100 / 3) * (step + 1)}
        theme={useTheme()}
      />
    </>
  );
}
