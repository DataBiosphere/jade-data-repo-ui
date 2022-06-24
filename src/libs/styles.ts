import { CSSProperties } from '@mui/material/styles/createMixins';

/**
 * Common style patterns to reuse
 */
export const ellipsis: CSSProperties = {
  wordWrap: 'break-word',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
};
