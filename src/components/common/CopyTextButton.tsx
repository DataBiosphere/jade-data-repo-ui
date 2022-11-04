import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import TerraTooltip from './TerraTooltip';

type CopyTextButtonProps = {
  valueToCopy: string;
  nameOfValue: string | undefined;
};

function CopyTextButton({ valueToCopy, nameOfValue }: CopyTextButtonProps) {
  const [toolTipText, setToolTipText] = useState('Copy to clipboard');

  const copyText = () => {
    navigator.clipboard.writeText(valueToCopy);
    setToolTipText(`${nameOfValue ?? 'Value'} Copied!`);
  };

  return (
    <TerraTooltip title={toolTipText}>
      <IconButton
        aria-label="Copy Snapshot ID"
        data-cy="copy-byttin"
        disableFocusRipple={true}
        disableRipple={true}
        onClick={copyText}
        size="small"
        sx={{
          boxShadow: 'none',
          color: 'primary.main',
          '&:hover': {
            color: 'primary.hover',
          },
        }}
      >
        <i className="fa-regular fa-clipboard" />
      </IconButton>
    </TerraTooltip>
  );
}

export default CopyTextButton;
