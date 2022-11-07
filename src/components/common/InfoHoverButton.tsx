import React from 'react';
import { IconButton } from '@mui/material';
import TerraTooltip from './TerraTooltip';

type InfoHoverButtonProps = {
  infoText: string;
  fieldName: string;
};

function InfoHoverButton({ infoText, fieldName }: InfoHoverButtonProps) {
  return (
    <TerraTooltip title={infoText}>
      <IconButton
        aria-label={`Show info about ${fieldName}`}
        data-cy="info-button"
        disableFocusRipple={true}
        disableRipple={true}
        size="small"
        sx={{
          boxShadow: 'none',
          color: 'primary.main',
          float: 'right',
          '&:hover': {
            color: 'primary.hover',
            cursor: 'default',
          },
        }}
      >
        <i className="fa-solid fa-circle-info" />
      </IconButton>
    </TerraTooltip>
  );
}

export default InfoHoverButton;
