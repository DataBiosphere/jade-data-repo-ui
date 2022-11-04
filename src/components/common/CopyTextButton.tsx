import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import TerraTooltip from './TerraTooltip';

type CopyTextButtonProps = {
  valueToCopy: string;
  nameOfValue: string;
};

function CopyTextButton({ valueToCopy, nameOfValue }: CopyTextButtonProps) {
  const [toolTipText, setToolTipText] = useState('Copy to clipboard');

  const copyText = () => {
    navigator.clipboard.writeText(valueToCopy);
    setToolTipText(`Copied: ${nameOfValue}`);
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
      >
        <i className="fa-light fa-copy" />
      </IconButton>
    </TerraTooltip>
  );
}

export default CopyTextButton;
